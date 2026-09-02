import { describe, expect, it } from "vitest";
import { education, experience, projectsOrdered } from "@/content";
import {
  AXIS_END_YEAR,
  AXIS_MONTHS,
  AXIS_START_YEAR,
  formatMonth,
  toMonthIndex,
  toPercent,
  years,
} from "@/lib/format/timeline";

/**
 * The axis used to be two literals -- 2023 and 2026 -- copied out of
 * education.dates into a lib module, feeding both the scrubber and the
 * whole 3D Time scene. A build dated 2027 would have pushed toPercent
 * past 100 and drawn the bar off the right-hand edge of the chart while
 * formatMonth clamped the scrubber at December 2026, putting the newest
 * work out of reach. Nothing would have thrown; the page would simply
 * have lied.
 *
 * So these tests are about that failure and not about the numbers. They
 * assert against the record rather than against 2023 and 2026, because
 * a test that hardcodes the answer cannot catch the axis and the record
 * disagreeing -- which is the only thing that ever went wrong here.
 */

const spans = [
  education.dates,
  ...experience.map((role) => role.dates),
  ...projectsOrdered.map((project) => project.dates),
];

describe("the axis covers everything on the record", () => {
  it("puts no dated thing outside the chart", () => {
    for (const span of spans) {
      const start = toPercent(toMonthIndex(span.start, "start"));
      const end = toPercent(toMonthIndex(span.end ?? span.start, "end"));
      expect(start, span.label + " starts off the chart").toBeGreaterThanOrEqual(0);
      expect(end, span.label + " ends off the chart").toBeLessThanOrEqual(100);
    }
  });

  it("does not run wider than the record needs", () => {
    // Both ends earn their place: something starts in the first year and
    // something ends in the last. An axis padded past the record would
    // draw empty time and pass the test above without meaning anything.
    const startYears = spans.map((s) => Number(s.start.slice(0, 4)));
    const endYears = spans.map((s) => Number((s.end ?? s.start).slice(0, 4)));
    expect(Math.min(...startYears)).toBe(AXIS_START_YEAR);
    expect(Math.max(...endYears)).toBe(AXIS_END_YEAR);
  });

  it("reaches the last month of the record", () => {
    const last = Math.max(
      ...spans.map((s) => toMonthIndex(s.end ?? s.start, "end"))
    );
    expect(last).toBeLessThanOrEqual(AXIS_MONTHS - 1);
    expect(formatMonth(last)).toContain(String(AXIS_END_YEAR));
  });
});

describe("toMonthIndex resolves a year-only value at year precision", () => {
  it("reads a bare year as January when it starts a span", () => {
    expect(toMonthIndex(String(AXIS_START_YEAR), "start")).toBe(0);
  });

  it("reads a bare year as December when it ends one", () => {
    expect(toMonthIndex(String(AXIS_START_YEAR), "end")).toBe(11);
  });

  it("defaults to the start edge", () => {
    expect(toMonthIndex("2025")).toBe(toMonthIndex("2025", "start"));
  });

  it("keeps the degree from finishing before the work done inside it", () => {
    // The degree is recorded as "2023 - 2026" with no graduation month;
    // it is UNKNOWN and will not be invented. Reading that end as
    // January 2026 would draw the degree ending before the March and May
    // 2026 builds, which is both wrong and visibly odd on the chart.
    //
    // Scoped to builds in the degree's final year on purpose. A build
    // AFTER graduation is ordinary and must be allowed to sit past the
    // end of the bar -- asserting otherwise would fail the day a job
    // outlasts the degree, which timeline.ts says is the normal case.
    const finalYear = education.dates.end ?? education.dates.start;
    const degreeEnd = toMonthIndex(finalYear, "end");
    const inside = projectsOrdered.filter((p) => p.dates.start.startsWith(finalYear));
    expect(inside.length, "no build in the degree's final year to check").toBeGreaterThan(0);
    for (const project of inside) {
      expect(
        degreeEnd,
        "the degree ends before " + project.name + " starts"
      ).toBeGreaterThanOrEqual(toMonthIndex(project.dates.start, "start"));
    }
  });

  it("uses the month when the record gives one", () => {
    const jan = toMonthIndex(AXIS_START_YEAR + "-01", "start");
    const dec = toMonthIndex(AXIS_START_YEAR + "-12", "start");
    expect(jan).toBe(0);
    expect(dec).toBe(11);
    expect(toMonthIndex(AXIS_START_YEAR + 1 + "-01")).toBe(12);
  });
});

describe("toPercent", () => {
  it("spans zero to a hundred across the axis", () => {
    expect(toPercent(0)).toBe(0);
    expect(toPercent(AXIS_MONTHS - 1)).toBe(100);
  });

  it("rises with the month", () => {
    for (let i = 1; i < AXIS_MONTHS; i++) {
      expect(toPercent(i)).toBeGreaterThan(toPercent(i - 1));
    }
  });
});

describe("formatMonth", () => {
  it("names the month and the year", () => {
    expect(formatMonth(0)).toBe("January " + AXIS_START_YEAR);
    expect(formatMonth(11)).toBe("December " + AXIS_START_YEAR);
    expect(formatMonth(12)).toBe("January " + (AXIS_START_YEAR + 1));
  });

  it("clamps rather than inventing time outside the axis", () => {
    expect(formatMonth(-40)).toBe(formatMonth(0));
    expect(formatMonth(AXIS_MONTHS + 40)).toBe(formatMonth(AXIS_MONTHS - 1));
    expect(formatMonth(AXIS_MONTHS - 1)).toBe("December " + AXIS_END_YEAR);
  });

  it("rounds a fractional scrubber position", () => {
    expect(formatMonth(0.4)).toBe(formatMonth(0));
    expect(formatMonth(0.6)).toBe(formatMonth(1));
  });
});

describe("the derived constants agree with each other", () => {
  it("counts one label per calendar year", () => {
    expect(years).toEqual(
      Array.from({ length: AXIS_END_YEAR - AXIS_START_YEAR + 1 }, (_, i) => AXIS_START_YEAR + i)
    );
    expect(AXIS_MONTHS).toBe(years.length * 12);
  });

  it("orders the axis forwards", () => {
    expect(AXIS_END_YEAR).toBeGreaterThanOrEqual(AXIS_START_YEAR);
  });
});
