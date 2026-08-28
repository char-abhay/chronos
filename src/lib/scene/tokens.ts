"use client";

/**
 * Read a design token out of CSS so the canvas and the stylesheet can
 * never disagree about a colour.
 *
 * styles/tokens.css is the single source of truth -- "never use a raw
 * colour value in a component" applies to a WebGL material exactly as it
 * applies to a div. Tokens are read at scene setup rather than per frame;
 * they only change when the destination hue changes, which is a route
 * event, not a render event.
 */
export function readToken(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value.length > 0 ? value : fallback;
}
