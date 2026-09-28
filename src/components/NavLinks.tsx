"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Site" className="hidden items-center gap-7 md:flex">
      {nav.map((n) => {
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`focus-ring rounded text-[0.95rem] font-medium transition-colors hover:text-sage ${active ? "text-sage" : "text-muted"}`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
