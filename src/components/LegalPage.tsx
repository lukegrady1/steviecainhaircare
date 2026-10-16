import Link from "next/link";
import { PageHeader } from "./PageHeader";

/*
  Shared frame for the Privacy Policy and Terms pages. Plain prose on the
  beige ground, sized for reading; no cards or flourishes. Carriers review
  these two pages during A2P 10DLC registration, so the copy has to be
  readable without scripts and reachable from the footer.
*/
export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} intro={`Last updated ${updated}.`} />
      <section className="pb-20 sm:pb-28">
        <article className="legal mx-auto max-w-3xl px-4 sm:px-6">{children}</article>
      </section>
    </>
  );
}

/* Cross-link between the two legal pages, used inside their copy. */
export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring rounded font-semibold text-ink underline decoration-sage/60 underline-offset-4 hover:text-sage"
    >
      {children}
    </Link>
  );
}
