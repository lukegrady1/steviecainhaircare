import type { Metadata } from "next";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/PageHeader";
import { Services } from "@/components/Services";
import { hoursSummary, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Haircut Online in Oklahoma City",
  alternates: { canonical: "/book/" },
  description:
    "Book a haircut, color, styling, or facial waxing appointment with Stevie Cain in Oklahoma City through Vagaro. Pick a service and a time; Vagaro confirms by email or text.",
};

/*
  Booking runs on Stevie's Vagaro account. This page stays as the site's
  booking landing (header button, footer, structured data and the sitemap all
  point here) and hands the visitor to Vagaro in a new tab. See the vagaro
  notes in src/lib/site.ts for why it is a link and not an embed.
*/
export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book Online"
        title="Pick a service, pick a time."
        intro={`Stevie takes bookings through Vagaro. Pick a service and a time there and you’ll get a confirmation and a reminder from Vagaro. ${hoursSummary}.`}
      />
      <section className="bg-beige-deep/50 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="card px-5 py-8 text-center sm:px-8 sm:py-10">
            <p className="t-eyebrow text-sage-deep">Book with Vagaro</p>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Vagaro opens in a new tab. First time? It takes a minute to create a free Vagaro
              account; after that you can book, reschedule or cancel in a couple of taps.
            </p>
            <a
              href={site.vagaro.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary focus-ring mt-6 inline-flex items-center gap-2"
            >
              Book on Vagaro
              <ArrowSquareOut size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Rather talk it through?{" "}
            <a
              href={site.phoneHref}
              className="font-semibold text-ink underline decoration-sage/60 underline-offset-4 hover:text-sage"
            >
              Call {site.phone}
            </a>
            . Walk-ins welcome.
          </p>
        </div>
      </section>
      <Services compact />
    </>
  );
}
