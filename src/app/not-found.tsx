import type { Metadata } from "next";
import Link from "next/link";
import { BookButton } from "@/components/BookButton";
import { PageHeader } from "@/components/PageHeader";
import { nav } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
  /* Drop the layout's home-page canonical; a 404 has no canonical URL. */
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title="That page isn’t here."
        intro="The link may be old or mistyped. Everything on the site is one tap away below."
      />
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="flex flex-wrap gap-3">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="btn btn-outline focus-ring">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <BookButton>Book Now</BookButton>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
