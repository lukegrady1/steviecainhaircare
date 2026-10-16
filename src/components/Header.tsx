import Image from "next/image";
import Link from "next/link";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { BookButton } from "./BookButton";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { site } from "@/lib/site";

/* Intrinsic size of public/images/logo.webp; the class sets the rendered height. */
const LOGO = { w: 480, h: 431 };

/*
  Sticky header. On a phone: logo, call, Book Now, menu. The two things a
  visitor actually does stay visible on every page; the section links sit
  behind the menu button. From md up the links are inline.
*/
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-beige/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-24 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 md:h-36">
        <Link href="/" className="focus-ring flex min-w-0 items-center rounded-lg">
          {/*
            Stevie's logo: sage "SC" monogram with black script on a white
            ground. The PNG has the white knocked out to alpha, and
            mix-blend-multiply makes any leftover near-white edge vanish
            into the beige header.
          */}
          <Image
            src="/images/logo.webp"
            alt="Stevie Cain Hair Care"
            width={LOGO.w}
            height={LOGO.h}
            priority
            className="h-20 w-auto mix-blend-multiply md:h-32"
          />
        </Link>

        <NavLinks />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={site.phoneHref}
            className="btn btn-outline btn-sm focus-ring !px-3 md:!px-4"
            aria-label={`Call ${site.phone}`}
          >
            <Phone size={18} weight="bold" aria-hidden="true" />
            <span className="hidden lg:inline">{site.phone}</span>
          </a>
          <BookButton className="btn btn-primary btn-sm">Book Now</BookButton>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
