import Link from "next/link";
import { Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BookButton } from "./BookButton";
import { Reveal } from "./Reveal";
import { formatDuration, formatPrice, serviceGroups, type Service, type ServiceGroup } from "@/lib/site";

/*
  `compact` (home page) shows the first few services in each group with a
  link to the full menu. The Services page renders every service; Hair has
  13, Waxing 5, Color 2, so Hair takes two columns with its list split in
  two and Waxing and Color stack in the third.
*/
export function Services({ compact = false }: { compact?: boolean }) {
  const [hair, waxing, color] = serviceGroups;
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {compact && (
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="t-eyebrow text-sage-deep">Services &amp; Pricing</p>
              <h2 className="t-headline mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">
                Cuts, color, and a clean finish.
              </h2>
            </div>
            <Link
              href="/services/"
              className="focus-ring inline-flex items-center gap-2 rounded font-semibold text-ink hover:text-sage"
            >
              Full menu &amp; prices
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </Reveal>
        )}

        {compact ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start">
            {serviceGroups.map((g, i) => (
              <Reveal key={g.id} delay={i * 80}>
                <GroupCard group={g} services={g.services.slice(0, 5)} more />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            <Reveal className="lg:col-span-2">
              <GroupCard group={hair} services={hair.services} columns />
            </Reveal>
            <div className="grid gap-6">
              <Reveal delay={80}>
                <GroupCard group={waxing} services={waxing.services} />
              </Reveal>
              <Reveal delay={160}>
                <GroupCard group={color} services={color.services} />
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/*
  On the home page the section has its own h2, so each group is an h3. On
  the Services page the h1 is the page header, so the groups are h2s.
*/
function GroupCard({
  group,
  services,
  columns = false,
  more = false,
}: {
  group: ServiceGroup;
  services: Service[];
  columns?: boolean;
  more?: boolean;
}) {
  const hidden = group.services.length - services.length;
  const Heading = more ? "h3" : "h2";
  return (
    <div className="card p-5 sm:p-6">
      <Heading className="t-headline text-2xl text-ink">{group.title}</Heading>
      <p className="mt-1 text-sm text-muted">{group.blurb}</p>
      <ul className={`mt-5 ${columns ? "md:grid md:grid-cols-2 md:gap-x-8" : ""}`}>
        {services.map((s) => (
          <li
            key={s.slug}
            className="flex items-start justify-between gap-4 border-t border-line py-3.5 first:border-t-0 md:[&:nth-child(2)]:border-t-0"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold text-ink">{s.name}</span>
                <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-sage-deep">
                  {formatPrice(s)}
                </span>
              </div>
              {s.description && !more && (
                <p className="mt-0.5 text-sm leading-snug text-muted">{s.description}</p>
              )}
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                <Clock size={13} aria-hidden="true" />
                {formatDuration(s.minutes)}
              </p>
            </div>
            <BookButton slug={s.slug} className="btn btn-dark btn-sm shrink-0" ariaLabel={`Book ${s.name}`}>
              Book
            </BookButton>
          </li>
        ))}
      </ul>
      {more && hidden > 0 && (
        <Link
          href="/services/"
          className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-ink hover:text-sage"
        >
          +{hidden} more {group.title.toLowerCase().replace(" services", "")} services
          <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
