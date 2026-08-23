import type { Destination } from "./schema";

/**
 * Eight regions -- every one of them about Abhay.
 *
 * The space naming is PRESENTATION: it drives the visual language,
 * the motion and the sense of travel between regions. It is not the
 * content. Each destination owns a real part of the portfolio, and the
 * curiosity comes from interaction -- things you click and uncover --
 * not from explanatory text.
 */
export const destinations: Destination[] = [
  {
    id: "home",
    index: "01",
    name: "Home",
    href: "/",
    scale: "Entry",
    hook: "Abhay P",
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
    name: "Origin",
    href: "/earth",
    scale: "Kasaragod → Bangalore",
    hook: "Where this started.",
  },
  {
    id: "solar-system",
    index: "04",
    name: "Systems",
    href: "/solar-system",
    scale: "5 built",
    hook: "Everything I have built.",
  },
  {
    id: "galaxy",
    index: "05",
    name: "Constellation",
    href: "/galaxy",
    scale: "6 clusters",
    hook: "What I can work with.",
  },
  {
    id: "black-holes",
    index: "06",
    name: "Pressure",
    href: "/black-holes",
    scale: "The hard parts",
    hook: "The problems that did not solve themselves.",
  },
  {
    id: "future",
    index: "07",
    name: "Next",
    href: "/future",
    scale: "Unwritten",
    hook: "Where this goes.",
  },
  {
    id: "story",
    index: "08",
    name: "Story",
    href: "/story",
    scale: "The whole arc",
    hook: "All of it, in one line.",
  },
];

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}
