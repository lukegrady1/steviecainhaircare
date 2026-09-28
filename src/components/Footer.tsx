import Image from "next/image";
import Link from "next/link";
import { BookButton } from "./BookButton";
import { hoursSummary, nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-sage-deep py-12 text-beige sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr_auto]">
        <div>
          <div className="inline-flex rounded-3xl bg-beige p-4">
            <Image
              src="/images/logo.png"
              alt="Stevie Cain Haircare"
              width={640}
              height={575}
              className="h-32 w-auto mix-blend-multiply sm:h-40"
            />
          </div>
          <p className="mt-4 text-beige/70">{site.tagline}</p>
          <address className="mt-5 space-y-1 text-sm not-italic text-beige/85">
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
            <p className="text-beige/70">{hoursSummary}</p>
          </address>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-beige/85 hover:text-sage">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book/" className="text-beige/85 hover:text-sage">
                Book Online
              </Link>
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
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-4 pt-6 text-xs text-beige/50 sm:px-6">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
