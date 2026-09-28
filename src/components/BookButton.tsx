import Link from "next/link";
import { bookHref } from "@/lib/site";

/*
  A "Book" link. With `slug`, the booking page opens with that service
  already selected in the calendar picker; without, it opens on the default.
  A plain link rather than a button so it works before hydration and can be
  opened in a new tab.
*/
export function BookButton({
  slug,
  className = "btn btn-primary",
  children,
  ariaLabel,
}: {
  slug?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link href={bookHref(slug)} className={`${className} focus-ring`} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
