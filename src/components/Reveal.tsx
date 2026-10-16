"use client";

import { useEffect, useRef } from "react";

/*
  Fade-up on first scroll into view. Markup starts visible (`reveal` alone is
  a no-op) and is only hidden once the observer is attached, so a blocked or
  slow script never leaves content invisible.
*/
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /* `li` keeps <ul> children valid when each list item reveals on its own. */
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    el.dataset.reveal = "pending";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.reveal = "in";
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
