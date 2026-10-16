import Image from "next/image";
import Link from "next/link";
import { BookButton } from "./BookButton";
import { hoursSummary, legalNav, nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-sage-deep py-12 text-beige sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr_auto]">
        <div>
          <div className="inline-flex rounded-3xl bg-beige p-4">
            <Image
              src="/images/logo.webp"
              alt="Stevie Cain Hair Care"
              width={480}
              height={431}
              className="h-32 w-auto mix-blend-multiply sm:h-40"
            />
          </div>
          <p className="mt-4 text-beige/90">{site.tagline}</p>
          <address className="mt-5 space-y-1 text-sm not-italic text-beige">
            <p>
              {site.address.line1} · {site.address.inside}
            </p>
            <p>
              {site.address.city}, {site.address.state} {site.address.zip}
            </p>
            <p>
              <a href={site.phoneHref} className="font-semibold text-beige hover:text-sage">
                {site.phone}
              </a>
            </p>
            <p className="text-beige/90">{hoursSummary}</p>
          </address>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-beige hover:text-sage">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book/" className="text-beige hover:text-sage">
                Book Online
              </Link>
            </li>
            <li>
              <a
                href={site.google.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-beige hover:text-sage"
              >
                Find us on Google
              </a>
            </li>
            <li>
              <a
                href={site.google.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-beige hover:text-sage"
              >
                Leave a review
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <BookButton className="btn btn-primary">Book Now</BookButton>
          <a href={site.phoneHref} className="btn btn-outline-light focus-ring">
            Call {site.phone}
          </a>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/10 px-4 pt-6 text-xs text-beige/90 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {legalNav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="text-beige/90 hover:text-sage">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
