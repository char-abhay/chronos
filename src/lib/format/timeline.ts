/**
 * Timeline maths. Pure functions, no React -- easy to reason about and
 * easy to check by hand.
 *
 * The axis runs January 2023 to December 2026: the whole span of the
 * degree, with nothing invented on either end.
 */
export const AXIS_START_YEAR = 2023;
export const AXIS_END_YEAR = 2026;
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
