import { bookHref } from "@/lib/site";

/*
  A "Book" link. Booking lives on Vagaro, so this opens Vagaro's services
  page in a new tab (each service has its own Book Now there). A plain anchor
  so it works before hydration.
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
