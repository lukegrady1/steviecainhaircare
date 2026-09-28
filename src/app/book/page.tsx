import type { Metadata } from "next";
import { BookOnline } from "@/components/BookOnline";
import { PageHeader } from "@/components/PageHeader";
import { hoursSummary, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Online",
  description:
    "Book a haircut, color, styling, or facial waxing appointment with Stevie Cain in Oklahoma City. Pick a service and a time; confirmations by text and email.",
};

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book Online"
        title="Pick a service, pick a time."
        intro={`Choose a service below, then a day and time. You’ll get a confirmation by text and email, plus a reminder the day before. ${hoursSummary}.`}
      />
      <section className="bg-beige-deep/50 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <BookOnline />
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
    </>
  );
}
