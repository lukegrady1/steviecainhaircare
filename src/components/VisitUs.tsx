import Link from "next/link";
import { MapPin, Car, CreditCard, Sparkle, ArrowSquareOut, Storefront, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { HoursTable } from "./HoursTable";
import { Reveal } from "./Reveal";
import { photos, site, visit } from "@/lib/site";

/*
  `compact` (home page) adds the section heading and a link to the full
  page; the Visit page supplies its own h1 via PageHeader.
*/
export function VisitUs({ compact = false }: { compact?: boolean }) {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {compact && (
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="t-eyebrow text-sage">Visit Us</p>
              <h2 className="t-headline mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">
                Inside Salons by JC, Suite 112.
              </h2>
            </div>
            <Link
              href="/visit/"
              className="focus-ring inline-flex items-center gap-2 rounded font-semibold text-ink hover:text-sage"
            >
              Hours, parking &amp; amenities
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </Reveal>
        )}

        {!compact && photos.suite.length > 0 && (
          <ul className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
            {photos.suite.map((p, i) => (
              <Reveal key={p.src} delay={i * 60}>
                <li className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line sm:aspect-[4/3]">
                  <Image src={p.src} alt={p.alt} fill sizes="33vw" className="object-cover" />
                </li>
              </Reveal>
            ))}
          </ul>
        )}

        <div className={`grid gap-6 lg:grid-cols-2 ${compact ? "mt-10" : ""}`}>
          <Reveal>
            <div className="card p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-deep text-beige">
                  <MapPin size={20} weight="duotone" aria-hidden="true" />
                </span>
                <address className="not-italic">
                  <p className="font-semibold text-ink">{site.name}</p>
                  <p className="text-muted">{site.address.line1}</p>
                  <p className="text-muted">
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-sage-deep">
                    <Storefront size={16} aria-hidden="true" />
                    {site.address.inside}
                  </p>
                </address>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={site.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark focus-ring"
                >
                  Get Directions
                  <ArrowSquareOut size={18} aria-hidden="true" />
                </a>
                <a href={site.phoneHref} className="btn btn-outline focus-ring">
                  Call {site.phone}
                </a>
              </div>

              <h3 className="mt-8 font-semibold text-ink">Hours</h3>
              <p className="mt-1 text-sm text-muted">{visit.walkIns}</p>
              <div className="mt-3">
                <HoursTable />
              </div>

              <dl className="mt-8 grid gap-5 sm:grid-cols-3">
                <Detail icon={Car} title="Parking">
                  {visit.parking}
                </Detail>
                <Detail icon={CreditCard} title="Payment">
                  {visit.payment.join(", ")}
                </Detail>
                <Detail icon={Sparkle} title="Amenities">
                  {visit.amenities.join(" · ")}
                </Detail>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <div className="card h-full min-h-[22rem] overflow-hidden lg:min-h-0">
              <iframe
                src={site.mapsEmbedSrc}
                title={`Map to ${site.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full min-h-[22rem] w-full border-0 lg:min-h-[36rem]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Detail({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        <Icon size={16} aria-hidden="true" />
        {title}
      </dt>
      <dd className="mt-1 text-sm leading-relaxed text-muted">{children}</dd>
    </div>
  );
}
