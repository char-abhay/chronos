"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { destinations } from "@/content/destinations";
import { cn } from "@/lib/cn";

/**
 * The universe map.
 *
 * THE decisive navigation choice (plan Section D): this is DOM and SVG,
 * not 3D. It buys the entire spatial-navigation feeling at roughly 5%
 * of the cost, keeps keyboard order and screen-reader semantics for
 * free, works identically on mobile, and cannot break when WebGL is
 * unavailable.
 *
 * Underneath the spatial layout it is an ordered list of links. A
 * screen reader hears "list, 8 items"; a sighted user sees a map.
 */

/** Positions as percentages. Presentation only -- order lives in the list. */
const layout: Record<string, { x: number; y: number }> = {
  home: { x: 12, y: 50 },
  time: { x: 27, y: 26 },
  earth: { x: 40, y: 68 },
  "solar-system": { x: 54, y: 38 },
  galaxy: { x: 68, y: 72 },
  "black-holes": { x: 80, y: 34 },
  future: { x: 92, y: 62 },
  story: { x: 50, y: 90 },
};

const order = [
  "home",
  "time",
  "earth",
  "solar-system",
  "galaxy",
  "black-holes",
  "future",
];

export function MapOverlay({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <div>
      <p className="max-w-reading text-secondary">
        Eight regions of one continuous universe. You can enter anywhere —
        nothing here is locked, and no order is required.
      </p>

      {/* Spatial layer: decorative, and hidden from assistive tech
          because the list below carries exactly the same links. */}
      <div
        aria-hidden="true"
        className="relative mt-8 hidden h-64 w-full sm:block"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {order.slice(0, -1).map((id, i) => {
            const a = layout[id];
            const b = layout[order[i + 1]];
            return (
              <line
                key={id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--hairline-strong)"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {destinations.map((d) => {
          const pos = layout[d.id];
          const active = pathname === d.href;
          return (
            <span
              key={d.id}
              style={{ left: pos.x + "%", top: pos.y + "%" }}
              className={cn(
                "absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                active ? "bg-signal" : "bg-[var(--text-faint)]"
              )}
            />
          );
        })}
      </div>

      {/* The actual navigation. */}
      <ol className="mt-8 grid gap-1 sm:grid-cols-2">
        {destinations.map((d) => {
          const active = pathname === d.href;
          return (
            <li key={d.id}>
              <Link
                href={d.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-baseline gap-4 rounded-[2px] px-3 py-2",
                  "transition-colors dur-micro hover:bg-ground-raised",
                  active && "bg-ground-raised"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-label tabular",
                    active ? "text-signal" : "text-faint"
                  )}
                >
                  {d.index}
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block font-display",
                      active ? "text-signal" : "text-primary"
                    )}
                  >
                    {d.name}
                  </span>
                  <span className="block text-body-sm text-muted">
                    {d.hook}
                  </span>
                </span>
                <span className="font-mono text-label text-faint tabular">
                  {d.scale}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
