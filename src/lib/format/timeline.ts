import { education, experience, projectsOrdered } from "@/content";

/**
 * Timeline maths. Pure functions, no React -- easy to reason about and
 * easy to check by hand.
 *
 * The axis runs from January of the earliest year on the record to
 * December of the latest, which today is 2023 to 2026: the whole span
 * of the degree, with nothing invented on either end.
 *
 * Those two years used to be written here as literals, which was
 * education.dates copied into a lib module. It fed the scrubber and,
 * through layout.ts, the entire 3D Time scene -- so the first build
 * dated 2027 would have pushed toPercent above 100 and drawn the bar
 * off the right-hand edge of the chart, while formatMonth clamped the
 * scrubber at December 2026 and made the newest work unreachable.
 * Nothing would have thrown. The page would simply have lied, which is
 * the one failure this site cannot afford.
 *
 * Every dated thing is included rather than just the degree, because a
 * job that outlasts the degree is the ordinary case and the axis has to
 * survive it.
 */
const spans = [
  education.dates,
  ...experience.map((role) => role.dates),
  ...projectsOrdered.map((project) => project.dates),
];

const boundaryYears = spans.flatMap((span) =>
  [span.start, span.end ?? span.start].map((value) => Number(value.slice(0, 4)))
);

export const AXIS_START_YEAR = Math.min(...boundaryYears);
export const AXIS_END_YEAR = Math.max(...boundaryYears);
export const AXIS_MONTHS = (AXIS_END_YEAR - AXIS_START_YEAR + 1) * 12;

/**
 * "2025-06" -> month index from January 2023.
 *
 * A year-only value carries year precision, so it is resolved at year
 * precision: January when it starts a span, December when it ends one.
 *
 * This matters. The degree is recorded as "2023 - 2026" with no
 * graduation month (it is UNKNOWN and will not be invented). Reading
 * that end as January 2026 would draw the degree finishing BEFORE the
 * March and May 2026 builds, which is both wrong and visibly odd.
 * Reading it as December 2026 states exactly what the data says: some
 * time in 2026.
 */
export function toMonthIndex(value: string, edge: "start" | "end" = "start"): number {
  const [yearPart, monthPart] = value.split("-");
  const year = Number(yearPart);
  const month = monthPart ? Number(monthPart) : edge === "end" ? 12 : 1;
  return (year - AXIS_START_YEAR) * 12 + (month - 1);
}

/** Month index -> percentage across the axis. */
export function toPercent(monthIndex: number): number {
  return (monthIndex / (AXIS_MONTHS - 1)) * 100;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Month index -> "March 2026". */
export function formatMonth(monthIndex: number): string {
  const clamped = Math.max(0, Math.min(AXIS_MONTHS - 1, Math.round(monthIndex)));
  const year = AXIS_START_YEAR + Math.floor(clamped / 12);
  return MONTH_NAMES[clamped % 12] + " " + year;
}

export const years = Array.from(
  { length: AXIS_END_YEAR - AXIS_START_YEAR + 1 },
  (_, i) => AXIS_START_YEAR + i
);
