"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

/*
  Home page gallery: a scroll-snap strip of every gallery photo with arrow
  buttons and a slow auto-advance. Native scrolling means swipe works on touch
  and the strip is usable before hydration; the script only adds the arrows'
  behavior and the timer. Auto-advance pauses while the strip is hovered,
  focused, being dragged, or off screen, and never runs for people who prefer
  reduced motion. At the end it wraps back to the first photo.
*/
const INTERVAL_MS = 3800;

export function GallerySlider({
  items,
}: {
  items: { src: string; alt: string }[];
}) {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.querySelector("li");
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const slide = first.getBoundingClientRect().width + gap;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - slide / 2;
    const atStart = el.scrollLeft <= slide / 2;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && atStart)
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * slide, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => step(1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, visible, step]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <div
      className="relative mt-10"
      aria-roledescription="carousel"
      aria-label="Recent haircuts"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <ul
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 scroll-pl-4 sm:-mx-6 sm:gap-4 sm:px-6 sm:scroll-pl-6"
      >
        {items.map((g, i) => (
          <li
            key={g.src}
            className="relative aspect-[4/5] w-[68%] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-beige-deep sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]"
          >
            <Image
              src={g.src}
              alt={g.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 68vw"
              priority={i < 2}
              className="object-cover"
            />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous photos"
        className="slider-arrow focus-ring left-3 sm:left-4"
      >
        <CaretLeft size={20} weight="bold" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next photos"
        className="slider-arrow focus-ring right-3 sm:right-4"
      >
        <CaretRight size={20} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}
