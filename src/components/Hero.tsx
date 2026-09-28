import { Phone, Star, Scissors } from "@phosphor-icons/react/dist/ssr";
import { BookButton } from "./BookButton";
import Image from "next/image";
import { photos, site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:pt-20 lg:pb-24">
        <div className="relative">
          <RatingBadge />
          {/*
            SEO: the h1 carries what people search for (services + city) and
            mirrors the title tag. The tagline stays visible above it as the
            brand voice, but as a paragraph so it does not dilute the heading.
          */}
          <p className="t-headline mt-6 text-2xl italic text-ink sm:text-3xl">{site.tagline}</p>
          <h1 className="t-display mt-3 text-[2.6rem] text-ink sm:text-5xl lg:text-[4.25rem]">
            Haircuts, Color &amp; Styling in Oklahoma City
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted sm:text-xl">
            Personalized cuts, fades, beards, color, and facial waxing with {site.owner}, a solo
            stylist inside Salons by JC. She listens first, then cuts for your hair and your life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BookButton className="btn btn-primary w-full sm:w-auto sm:min-w-[15rem]">
              Book Your Appointment
            </BookButton>
            <a href={site.phoneHref} className="btn btn-outline focus-ring w-full sm:w-auto">
              <Phone size={20} weight="bold" aria-hidden="true" />
              Call {site.phone}
            </a>
          </div>
          <p className="mt-5 text-sm text-muted">
            Walk-ins welcome · Appointments recommended · Inside Salons by JC, Suite 112
          </p>
        </div>

        {/* Studio photo slot. Placeholder tile until a photo is dropped in. */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="placeholder-tile relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line shadow-lift">
            {photos.studio ? (
              <Image
                src={photos.studio.src}
                alt={photos.studio.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 28rem"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink/40">
                <Scissors size={44} weight="thin" aria-hidden="true" />
                <span className="t-eyebrow">Studio photo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RatingBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink">
      <span className="flex items-center gap-0.5 text-sage" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} weight="fill" />
        ))}
      </span>
      <span>
        {site.rating.value}
        <span className="sr-only"> out of 5 stars</span>
      </span>
      <span className="font-normal text-muted">· {site.rating.count} verified reviews</span>
    </div>
  );
}
