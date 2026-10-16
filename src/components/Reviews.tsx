import { Star, Quotes } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { reviews, site } from "@/lib/site";

export function Reviews() {
  return (
    <section className="bg-sage-pale py-16 text-ink sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="t-eyebrow text-sage-deep">Reviews</p>
            <h2 className="t-headline mt-3 text-3xl sm:text-4xl lg:text-5xl">
              Folks leave the chair happy.
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
            <span className="t-headline text-4xl text-sage">{site.rating.value}</span>
            <div>
              <span className="flex gap-0.5 text-sage" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} weight="fill" />
                ))}
              </span>
              <span className="mt-0.5 block text-sm text-muted">
                {site.rating.count} verified reviews
              </span>
            </div>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <Reveal
              as="li"
              key={r.name}
              delay={i * 70}
              className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5"
            >
                <Quotes size={26} weight="fill" className="text-sage" aria-hidden="true" />
                <blockquote className="mt-3 flex-1 text-[1.02rem] leading-relaxed text-ink">
                  “{r.quote}”
                </blockquote>
                <footer className="mt-4 flex items-center justify-between text-sm">
                  <cite className="not-italic font-semibold">{r.name}</cite>
                  <span role="img" className="flex gap-0.5 text-sage" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} size={13} weight="fill" aria-hidden="true" />
                    ))}
                  </span>
                </footer>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
