import Image from "next/image";
import Link from "next/link";
import { Scissors, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { gallery } from "@/lib/site";

export function Gallery({ limit }: { limit?: number }) {
  const items = limit ? gallery.slice(0, limit) : gallery;
  const compact = Boolean(limit);
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {compact && (
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="t-eyebrow text-sage">Gallery</p>
              <h2 className="t-headline mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">
                Recent work from the chair.
              </h2>
            </div>
            <Link
              href="/gallery/"
              className="focus-ring inline-flex items-center gap-2 rounded font-semibold text-ink hover:text-sage"
            >
              See the gallery
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </Reveal>
        )}
        <ul className={`grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 ${compact ? "mt-10" : ""}`}>
          {items.map((g, i) => (
            <Reveal key={`${g.alt}-${i}`} delay={(i % 4) * 60}>
              <li className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-beige-deep">
                {g.src ? (
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out)] hover:scale-[1.03]"
                  />
                ) : (
                  <div className="placeholder-tile absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink/40">
                    <Scissors size={30} weight="thin" aria-hidden="true" />
                    <span className="px-3 text-center text-xs font-medium">{g.alt}</span>
                  </div>
                )}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
