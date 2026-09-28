"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { nav, site } from "@/lib/site";

/*
  Phone-only nav. A sheet under the header rather than a full-screen overlay:
  the page is short, the links are few, and the Book button stays visible.
*/
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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
