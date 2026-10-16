import Image from "next/image";
import Link from "next/link";
import { Ear, Scissors, Armchair, User, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BookButton } from "./BookButton";
import { Reveal } from "./Reveal";
import { about, photos, site } from "@/lib/site";

const icons = [Ear, Scissors, Armchair];

/*
  `compact` is the home-page teaser: quote, first paragraph, values, and a
  link to the full page. The About page renders everything and relies on
  PageHeader for its h1.
*/
export function About({ compact = false }: { compact?: boolean }) {
  const paragraphs = compact ? about.body.slice(0, 1) : about.body;
  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-line shadow-lift lg:max-w-none">
            {photos.portrait ? (
              <Image
                src={photos.portrait.src}
                alt={photos.portrait.alt}
                fill
                priority={!compact}
                sizes="(min-width: 1024px) 40vw, 24rem"
                className="object-cover"
              />
            ) : (
              <div className="placeholder-tile absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink/40">
                <User size={44} weight="thin" aria-hidden="true" />
                <span className="t-eyebrow">Photo of Stevie</span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={80}>
          {compact ? (
            <>
              <p className="t-eyebrow text-sage-deep">About Stevie</p>
              <h2 className="t-headline mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">{about.quote}</h2>
            </>
          ) : (
            <h2 className="t-headline text-3xl text-ink sm:text-4xl">About me</h2>
          )}
          <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-muted">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 font-display text-lg italic text-ink">— {site.owner}</p>
          {!compact && (
            <div className="mt-6">
              <BookButton>Book Your Appointment</BookButton>
            </div>
          )}

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {about.values.map((v, i) => {
              const Icon = icons[i];
              return (
                <li key={v.title} className="rounded-2xl border border-line bg-beige p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage-deep text-beige">
                    <Icon size={20} weight="duotone" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
                </li>
              );
            })}
          </ul>

          {compact && (
            <Link
              href="/about/"
              className="focus-ring mt-8 inline-flex items-center gap-2 rounded font-semibold text-ink hover:text-sage"
            >
              More about Stevie
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
