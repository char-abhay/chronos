"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AXIS_MONTHS,
  formatMonth,
  toMonthIndex,
  toPercent,
  years,
} from "@/lib/format/timeline";
import { cn } from "@/lib/cn";

export type TrackItem = {
  id: string;
  label: string;
  meta: string;
  /** "2023" or "2025-06" */
  start: string;
  end: string;
  kind: "education" | "internship" | "build";
  href?: string;
  detail?: string;
  /**
   * Anything further this item wants written out beneath `detail`.
   * It travels on the item so a consumer rendering a list of tracks
   * cannot reach back into the source array by index and fetch the
   * wrong row's words -- which is exactly what /time used to do.
   */
  extra?: string[];
};

/**
 * The flagship interaction: drag across three years and watch what was
 * happening at each point.
 *
 * Why this earns the "flagship" slot on a site called CHRONOS -- it is
 * the one place where time is the interface rather than the subject.
 * It also reveals something true that a list cannot: the degree runs as
 * one long bar across the whole axis, and every build sits inside its
 * final stretch. The shape of the work is the insight.
 *
 * That used to read "the final twelve months", which was not true --
 * two of the five builds are dated June and October 2025, outside a
 * 2026 window. No number replaces it, deliberately: the shape is what
 * the interaction reveals and the shape holds whatever gets added,
 * while a count written here is a count nothing checks.
 *
 * Accessibility is not sacrificed for the effect:
 *   - it is a real <input type="range">, so arrows, Home and End all
 *     work natively and it is announced as a slider
 *   - aria-valuetext says "March 2026 — dVoting", not "37"
 *   - the bars are aria-hidden decoration; the plate below and the full
 *     list underneath carry the same information as text
 *
 * The plate below is deliberately NOT a live region. It once was, which
 * meant every arrow-key press re-announced the whole panel -- headings,
 * links, meta lines, detail paragraphs -- for a one-month move. The
 * slider's own aria-valuetext already announces exactly the summary a
 * live region would have carried, so a second one would only double it.
 */
export function TimeScrubber({ items }: { items: TrackItem[] }) {
  // Open on the most recent BUILD, not the latest date on the axis --
  // the degree runs to the end of 2026, and landing there would show an
  // empty stretch instead of the newest work.
  const latestBuild = Math.max(
    ...items
      .filter((i) => i.kind !== "education")
      .map((i) => toMonthIndex(i.end, "end"))
  );
  const [month, setMonth] = useState(latestBuild);

  const spans = items.map((item) => {
    const from = toMonthIndex(item.start, "start");
    const to = toMonthIndex(item.end, "end");
    return { item, from, to };
  });

  const active = spans.filter((s) => month >= s.from && month <= s.to);
  const activeLabel =
    active.length > 0 ? active.map((s) => s.item.label).join(", ") : "nothing";

  return (
    <div className="flex flex-col gap-8">
      {/* ---------- THE AXIS ---------- */}
      <div>
        <div aria-hidden="true" className="relative">
          {/* Year ticks */}
          <div className="relative h-5">
            {years.map((year) => (
              <span
                key={year}
                style={{ left: toPercent((year - years[0]) * 12) + "%" }}
                className="absolute top-0 -translate-x-1/2 font-mono text-label text-muted tabular"
              >
                {year}
              </span>
            ))}
          </div>

          {/* Tracks */}
          <div className="relative mt-2 flex flex-col gap-1.5">
            {spans.map(({ item, from, to }) => {
              const left = toPercent(from);
              const width = Math.max(toPercent(to - from), 1.4);
              const lit = month >= from && month <= to;
              return (
                <div key={item.id} className="relative h-7">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--hairline)]" />
                  <div
                    style={{ left: left + "%", width: width + "%" }}
                    className={cn(
                      "absolute top-1/2 h-2.5 -translate-y-1/2 rounded-[1px]",
                      "transition-all dur-ui",
                      lit
                        ? item.kind === "education"
                          ? "bg-[color-mix(in_srgb,var(--data)_60%,transparent)]"
                          : "bg-signal"
                        : "bg-[var(--text-faint)] opacity-40"
                    )}
                  />
                </div>
              );
            })}

            {/* Playhead */}
            <div
              style={{ left: toPercent(month) + "%" }}
              className="pointer-events-none absolute inset-y-0 w-px bg-signal"
            />
          </div>
        </div>

        {/* The control itself, overlaying the tracks. */}
        <label className="mt-4 block">
          <span className="font-mono text-label uppercase tracking-label text-data">
            Scrub the timeline
          </span>
          <input
            type="range"
            min={0}
            max={AXIS_MONTHS - 1}
            step={1}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            aria-valuetext={formatMonth(month) + " — " + activeLabel}
            className="mt-3 w-full accent-[var(--signal)]"
          />
        </label>
      </div>

      {/* ---------- WHAT WAS HAPPENING ---------- */}
      <div className="min-h-40 rounded-[2px] border border-hairline bg-ground-raised p-6">
        <p className="font-mono text-label uppercase tracking-label text-data tabular">
          {formatMonth(month)}
        </p>

        {active.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-4">
            {active.map(({ item }) => (
              <li key={item.id}>
                <p className="font-mono text-label uppercase tracking-label text-muted">
                  {item.kind === "education"
                    ? "Studying"
                    : item.kind === "internship"
                      ? "Working"
                      : "Building"}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-1 block font-display text-body-lg text-signal underline underline-offset-4 decoration-hairline hover:decoration-signal"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <p className="mt-1 font-display text-body-lg text-primary">
                    {item.label}
                  </p>
                )}
                <p className="mt-0.5 text-body-sm text-muted">{item.meta}</p>
                {item.detail ? (
                  <p className="mt-2 max-w-reading text-body-sm text-secondary">
                    {item.detail}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-secondary">
            Nothing on the record here.
          </p>
        )}
      </div>
    </div>
  );
}
