import { bookHref } from "@/lib/site";

/*
  A "Book" link. Booking lives on Vagaro, so this opens Vagaro in a new tab:
  with `slug`, the services list (each service has its own Book Now there);
  without, the booking page. A plain anchor so it works before hydration.
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
    <a
      href={bookHref(slug)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} focus-ring`}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
