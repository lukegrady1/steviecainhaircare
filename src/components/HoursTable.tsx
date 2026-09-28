"use client";

import { useSyncExternalStore } from "react";
import { hours } from "@/lib/site";

const noSubscribe = () => () => {};

/*
  Today's row is highlighted on the client only. The server snapshot is null,
  so the prerendered HTML (which cannot know the visitor's day) matches on
  hydration, then the client re-renders with the real day.
*/
export function HoursTable() {
  const today = useSyncExternalStore(
    noSubscribe,
    () => new Date().getDay(),
    () => null,
  );

  return (
    <table className="w-full text-[0.95rem]">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {hours.map((h, i) => {
          const isToday = today === i;
          return (
            <tr
              key={h.day}
              className={`border-t border-line ${isToday ? "bg-sage-light/60 font-semibold text-ink" : ""}`}
            >
              <th scope="row" className="py-2.5 pr-3 text-left font-medium">
                {h.day}
                {isToday && <span className="ml-2 text-xs text-sage-deep">Today</span>}
              </th>
              <td className={`py-2.5 text-right tabular-nums ${h.open ? "" : "text-muted"}`}>
                {h.label}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
