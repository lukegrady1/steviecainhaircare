import { Phone } from "@phosphor-icons/react/dist/ssr";
import { BookButton } from "./BookButton";
import { site } from "@/lib/site";

/* Closing call to action for inner pages. */
export function CtaBand() {
  return (
    <section className="bg-sage-pale py-14 text-ink sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="t-headline text-3xl sm:text-4xl">Ready when you are.</h2>
          <p className="mt-2 max-w-md text-muted">
            Book online in under a minute, or call and Stevie will find you a time. Walk-ins welcome.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <BookButton>Book Your Appointment</BookButton>
          <a href={site.phoneHref} className="btn btn-outline focus-ring">
            <Phone size={20} weight="bold" aria-hidden="true" />
            Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
