"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { nav, site } from "@/lib/site";

/*
  Phone-only nav. A sheet under the header rather than a full-screen overlay:
  the page is short, the links are few, and the Book button stays visible.

  The sheet closes on any route change, not just its own links: the header's
  Book Now button and logo navigate client-side, so without this the sheet
  stayed open on the next page. Escape closes it too.
*/
export function MobileMenu() {
  const pathname = usePathname();
  /*
    The sheet remembers which path it was opened on; it counts as open only
    while that is still the current path, so navigating anywhere closes it
    with no effect or extra state.
  */
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full text-ink"
      >
        {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Site"
          className="absolute inset-x-0 top-full border-b border-line bg-beige px-4 pb-5 pt-2 shadow-lift"
        >
          <ul className="divide-y divide-line">
            {nav.map((n) => {
              const active = pathname === n.href;
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`focus-ring block rounded py-3.5 text-lg font-medium ${active ? "text-sage" : "text-ink"}`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <a href={site.phoneHref} className="btn btn-outline focus-ring mt-4 w-full">
            Call {site.phone}
          </a>
        </nav>
      )}
    </div>
  );
}
