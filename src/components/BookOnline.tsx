"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { calendarIdFor, findService, groupWidgetSrc, site } from "@/lib/site";

/*
  Embedded GoHighLevel booking.

  Default: the group "service menu" widget, so the visitor picks the service
  inside the embed and goes straight on to a date and time. A Book button on
  a specific service links here with ?service=<slug>, which loads that one
  calendar instead so nobody has to find it again in the menu; a link under
  it goes back to the full menu.

  form_embed.js is what makes the iframe usable: the widget posts its content
  height to the parent and the script resizes the iframe to match, so the
  page scrolls rather than the calendar scrolling inside a box. Do NOT add
  scrolling="no" or overflow:hidden: if the script is blocked they leave a
  clipped box that cannot scroll, whereas without them the fallback is a
  fixed-height box that scrolls internally, which is usable.
*/
export function BookOnline() {
  return (
    <Suspense fallback={<Embed src={groupWidgetSrc} title="Book an appointment" />}>
      <FromUrl />
    </Suspense>
  );
}

/* useSearchParams needs a Suspense boundary on a statically exported page. */
function FromUrl() {
  const slug = useSearchParams().get("service");
  const service = findService(slug);
  const calendarId = service ? calendarIdFor(service.slug) : "";

  if (service && calendarId) {
    return (
      <div>
        <p className="mb-4 text-sm text-muted">
          Booking <strong className="font-semibold text-ink">{service.name}</strong>.{" "}
          <Link
            href="/book/"
            className="focus-ring inline-flex items-center gap-1 rounded font-semibold text-ink underline decoration-sage/60 underline-offset-4 hover:text-sage"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden="true" />
            See all services
          </Link>
        </p>
        <Embed
          key={calendarId}
          src={`${site.ghlHost}/widget/booking/${calendarId}`}
          title={`Book ${service.name}`}
        />
      </div>
    );
  }
  return <Embed src={groupWidgetSrc} title="Choose a service and book" />;
}

function Embed({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  /*
    Scroll back to the top of the embed whenever the widget moves to a new
    step. The widget reports its content height to the parent through
    iframe-resizer messages ("[iFrameSizer]<id>:<height>:<width>:<type>");
    a step change (service -> date/time -> details -> confirmation) is a
    big height change, so that is the signal. The first report is the
    initial sizing, before the visitor has done anything, and is ignored so
    the page does not jump on load.
  */
  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    let lastHeight: number | null = null;
    let timer: number | undefined;

    const onMessage = (e: MessageEvent) => {
      if (typeof e.data !== "string" || !e.data.startsWith("[iFrameSizer]")) return;
      if (e.source !== iframe.contentWindow) return;
      const [, heightStr] = e.data.slice("[iFrameSizer]".length).split(":");
      const height = Number(heightStr);
      if (!Number.isFinite(height) || height <= 0) return;
      if (lastHeight === null) {
        lastHeight = height;
        return;
      }
      if (Math.abs(height - lastHeight) < 40) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const header = document.querySelector("header");
        const offset = (header?.getBoundingClientRect().height ?? 0) + 12;
        const top = iframe.getBoundingClientRect().top + window.scrollY - offset;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }, 80);
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
    };
  }, [src]);

  return (
    <div className="card overflow-hidden">
      <iframe
        ref={ref}
        src={src}
        title={title}
        className="w-full"
        style={{ border: "none", height: 760 }}
      />
      <Script src={`${site.ghlHost}/js/form_embed.js`} strategy="afterInteractive" />
    </div>
  );
}
