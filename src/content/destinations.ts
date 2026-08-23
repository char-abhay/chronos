import type { Destination } from "./schema";

/**
 * The eight regions of one continuous universe.
 *
 * `scale` is the marker in each ARRIVAL stamp. It is the mechanism that
 * makes the scale ladder felt rather than stated -- the numbers step by
 * orders of magnitude while the typography stays identical.
 */
export const destinations: Destination[] = [
  {
    id: "home",
    index: "01",
    name: "Home",
    href: "/",
    scale: "Here · now",
    hook: "You are looking at the past.",
  },
  {
    id: "time",
    index: "02",
    name: "Time",
    href: "/time",
    scale: "One second",
    hook: "Two clocks can disagree and both be right.",
  },
  {
    id: "earth",
    index: "03",
    name: "Earth",
    href: "/earth",
    scale: "12,742 km",
    hook: "The only place the arrow of time has ever been observed by anyone.",
  },
  {
    id: "solar-system",
    index: "04",
    name: "Solar System",
    href: "/solar-system",
    scale: "8 light-minutes",
    hook: "Sunlight is already old when it reaches you.",
  },
  {
    id: "galaxy",
    index: "05",
    name: "Galaxy",
    href: "/galaxy",
    scale: "100,000 light-years",
    hook: "Every point of light here is a different age.",
  },
  {
    id: "black-holes",
    index: "06",
    name: "Black Holes",
    href: "/black-holes",
    scale: "Beyond return",
    hook: "Where the intuition stops working.",
  },
  {
    id: "future",
    index: "07",
    name: "Future",
    href: "/future",
    scale: "Not yet",
    hook: "The one region nobody has observed.",
  },
  {
    id: "story",
    index: "08",
    name: "My Story",
    href: "/story",
    scale: "2023 — now",
    hook: "Every future becomes someone's past.",
  },
];

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}
