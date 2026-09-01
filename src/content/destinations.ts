import { spell } from "@/lib/format/count";
import { education } from "./education";
import { projectsOrdered } from "./projects";
import type { Destination } from "./schema";
import { skillGroups } from "./skills";

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
 *
 * Where a scale or a hook counts something, it counts it from the
 * record. These render in the Arrival banner on four pages, in the nav
 * rail, in the map and on the 404 -- so a sixth build used to update
 * the Solar System page while its own arrival stamp went on announcing
 * five, on the same screen. A count is not an independent fact; it is a
 * property of the list, and it belongs to the list.
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
    scale:
      education.dates.start + " — " + (education.dates.end ?? education.dates.start),
    hook:
      spell(
        Number(education.dates.end ?? education.dates.start) -
          Number(education.dates.start)
      ) + " years, in order.",
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
    scale: projectsOrdered.length + " built",
    hook: spell(projectsOrdered.length) + " builds, still in orbit.",
  },
  {
    id: "galaxy",
    index: "05",
    name: "Galaxy",
    href: "/galaxy",
    scale: skillGroups.length + " clusters",
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
