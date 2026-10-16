"use client";

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { findService, groupOf, site } from "@/lib/site";

/*
  Embedded GoHighLevel booking page (Services module): every service by
  category, then date and time, then the visitor's details.

  form_embed.js is what makes the iframe usable: the page posts its content
  height to the parent and the script resizes the iframe to match, so the
  page scrolls rather than the booking page scrolling inside a box
  (heightMode=full). Do NOT add overflow:hidden on the wrapper: if the script
  is blocked the fallback is a fixed-height box that scrolls internally, which
  is still usable.

  The booking page cannot preselect a service from the URL, so a Book button
  on a specific service (/book/?service=<slug>) just shows a hint naming the
  service and its category above the menu.
*/
export function BookOnline() {
  return (
    <Suspense fallback={<Embed />}>
      <WithHint />
    </Suspense>
  );
}

/* useSearchParams needs a Suspense boundary on a statically exported page. */
function WithHint() {
  const service = findService(useSearchParams().get("service"));
  return (
    <div>
      {service && (
        <p className="mb-4 text-sm text-muted">
          Looking for <strong className="font-semibold text-ink">{service.name}</strong>? It is
          under {groupOf(service).title} below. Tap Book next to it to pick a time.
        </p>
      )}
      <Embed />
    </div>
  );
}

function Embed() {
  const ref = useRef<HTMLIFrameElement>(null);

  /*
    Scroll back to the top of the embed whenever the booking page moves to a
    new step (services -> review -> date/time -> details -> confirmation).
    The page reports its content height through iframe-resizer messages
    ("[iFrameSizer]<id>:<height>:<width>:<type>"); a step change is a big
    height change, so that is the signal. The page reports several heights
    while it loads, so nothing counts as a step until 1.5 s after the
    iframe's load event; otherwise the page would jump on arrival.
  */
  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    let lastHeight: number | null = null;
    let armedAt = Number.POSITIVE_INFINITY;
    let timer: number | undefined;

    const onLoad = () => {
      armedAt = performance.now() + 1500;
    };
    iframe.addEventListener("load", onLoad);

    const onMessage = (e: MessageEvent) => {
      if (typeof e.data !== "string" || !e.data.startsWith("[iFrameSizer]")) return;
      if (e.source !== iframe.contentWindow) return;
      const [, heightStr] = e.data.slice("[iFrameSizer]".length).split(":");
      const height = Number(heightStr);
      if (!Number.isFinite(height) || height <= 0) return;
      const previous = lastHeight;
      lastHeight = height;
      if (previous === null || performance.now() < armedAt) return;
      if (Math.abs(height - previous) < 40) return;
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
      iframe.removeEventListener("load", onLoad);
      window.clearTimeout(timer);
    };
  }, []);

  /*
    form_embed.js hides the iframe (display: none) until the page has loaded,
    then sets its real height. Without a reserved box the text and footer
    below jump up for a few seconds and back down, which measured as 0.3 CLS.
    The wrapper's min-height holds that space; the iframe itself starts at
    the same height and then grows with the content.
  */
  return (
    <div className="card overflow-hidden">
      <div className="min-h-[600px] md:min-h-[760px]">
        <iframe
          ref={ref}
          src={site.bookingPage}
          title="Choose a service and book an appointment"
          allow="payment"
          className="block h-[600px] w-full border-0 md:h-[760px]"
        />
      </div>
      <Script src={`${site.ghlHost}/js/form_embed.js`} strategy="afterInteractive" />
      <p className="border-t border-line px-5 py-3 text-center text-xs text-muted">
        Calendar not loading?{" "}
        <a
          href={site.bookingPage.split("?")[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring rounded font-semibold text-ink underline decoration-sage/60 underline-offset-4 hover:text-sage"
        >
          Open it in a new tab
        </a>
        .
      </p>
    </div>
  );
}
