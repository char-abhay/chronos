import type { Destination } from "./schema";

/**
 * Eight regions -- every one of them about Abhay.
 *
 * NAMES STAY SCIENTIFIC AND LITERAL (Abhay, 2026-08-24). Navigation is
 * where a visitor must never have to decode anything, so the rail says
 * Earth, Solar System, Galaxy, Black Holes. The cinematic feel is
 * carried by the visual design, the motion and the interactions -- not
 * by making the reader guess what a label means.
 *
 * The hooks are the curiosity layer: short, atmospheric, and slightly
 * withholding. They should make someone want to open a region, never
 * summarise what is inside it.
 */
export const destinations: Destination[] = [
  {
    id: "home",
    index: "01",
    name: "Home",
    href: "/",
    scale: "Entry",
    hook: "Start here.",
  },
  {
    id: "time",
    index: "02",
    name: "Time",
    href: "/time",
    scale: "2023 — 2026",
    hook: "Three years, in order.",
  },
  {
    id: "earth",
    index: "03",
    name: "Earth",
    href: "/earth",
    scale: "Kasaragod → Bangalore",
    hook: "Where this started.",
  },
  {
    id: "solar-system",
    index: "04",
    name: "Solar System",
    href: "/solar-system",
    scale: "5 built",
    hook: "Five builds, still in orbit.",
  },
  {
    id: "galaxy",
    index: "05",
    name: "Galaxy",
    href: "/galaxy",
    scale: "6 clusters",
    hook: "What connects to what.",
  },
  {
    id: "black-holes",
    index: "06",
    name: "Black Holes",
    href: "/black-holes",
    scale: "The hard parts",
    hook: "The problems that did not solve themselves.",
  },
  {
    id: "future",
    index: "07",
    name: "Future",
    href: "/future",
    scale: "Unwritten",
    hook: "Where this goes.",
  },
  {
    id: "story",
    index: "08",
    name: "My Story",
    href: "/story",
    scale: "The whole arc",
    hook: "All of it, in one line.",
  },
];

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}
