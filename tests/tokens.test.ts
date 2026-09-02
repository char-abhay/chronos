import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The contrast floor, computed rather than asserted.
 *
 * README lists "contrast has a documented floor" among the
 * non-negotiables, and tokens.css writes a measured ratio beside each
 * text colour. Documented is not the same as enforced: both the hex and
 * the number beside it are hand-maintained, and a colour nudged half a
 * step darker takes its comment with it and nothing notices.
 *
 * So this reads the hexes straight out of tokens.css -- the file the
 * whole design system calls its single source of truth -- computes the
 * WCAG 2.1 ratios, and checks two things: that every colour carrying
 * meaning clears AA on every background level it can land on, and that
 * the numbers written in the comments are the numbers the colours
 * actually produce.
 */

const TOKENS = fs.readFileSync(
  path.join(process.cwd(), "src", "styles", "tokens.css"),
  "utf8"
);

/** Reads `--name: #rrggbb;` out of the stylesheet. */
function token(name: string): string {
  const match = TOKENS.match(new RegExp("--" + name + ":\\s*(#[0-9a-fA-F]{3,8})"));
  expect(match, "no --" + name + " in tokens.css").not.toBeNull();
  return match![1];
}

/** The number written in the comment beside a token, e.g. `~5.4:1`. */
function documentedRatio(name: string): number {
  const match = TOKENS.match(
    new RegExp("--" + name + ":[^\\n]*?([0-9]+(?:\\.[0-9]+)?):1")
  );
  expect(match, "no documented ratio beside --" + name).not.toBeNull();
  return Number(match![1]);
}

const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

const AA_BODY = 4.5;

const GROUNDS = {
  ground: token("ground"),
  "ground-raised": token("ground-raised"),
  "ground-inset": token("ground-inset"),
};

/** Everything that carries meaning rather than decoration. */
const MEANINGFUL = [
  "text-primary",
  "text-secondary",
  "text-muted",
  "signal",
  "data",
  "status-warn",
  "status-error",
  "status-ok",
];

describe("every meaningful colour clears WCAG AA on every ground level", () => {
  // All three levels, because all three are used as backgrounds in the
  // components -- raised most of all, which is also the one the floor
  // was never measured against.
  for (const name of MEANINGFUL) {
    for (const [groundName, ground] of Object.entries(GROUNDS)) {
      it(name + " on " + groundName, () => {
        const ratio = contrast(token(name), ground);
        expect(
          ratio,
          "--" + name + " on --" + groundName + " is " + ratio.toFixed(2) + ":1"
        ).toBeGreaterThanOrEqual(AA_BODY);
      });
    }
  }
});

describe("the ratios written in tokens.css are the ratios the colours produce", () => {
  // Measured against --ground, which is what the section header in
  // tokens.css says these numbers mean.
  for (const name of ["text-primary", "text-secondary", "text-muted", "text-faint"]) {
    it(name, () => {
      const actual = contrast(token(name), GROUNDS.ground);
      const claimed = documentedRatio(name);
      // The comments carry one decimal place and a tilde, so a tenth of
      // a point either way is the comment being rounded, not wrong.
      expect(
        Math.abs(actual - claimed),
        "--" + name + " is documented at " + claimed + ":1 but measures " + actual.toFixed(2) + ":1"
      ).toBeLessThanOrEqual(0.1);
    });
  }

  it("status-error, which is documented against raised plates instead", () => {
    const actual = contrast(token("status-error"), GROUNDS["ground-raised"]);
    expect(Math.abs(actual - documentedRatio("status-error"))).toBeLessThanOrEqual(0.1);
  });

  it("the second figure beside text-muted, for raised plates", () => {
    // The floor comment carries two numbers because muted text lands on
    // two different grounds. Pinning only the first would leave half the
    // sentence free to drift.
    const onRaised = contrast(token("text-muted"), GROUNDS["ground-raised"]);
    const claimed = Number(
      TOKENS.match(/([0-9.]+):1 on --ground-raised/)?.[1] ?? "0"
    );
    expect(claimed, "no raised-plate figure beside --text-muted").toBeGreaterThan(0);
    expect(Math.abs(onRaised - claimed)).toBeLessThanOrEqual(0.1);
  });
});

describe("text-faint stays decorative", () => {
  it("does not clear AA, so it can never quietly become load-bearing", () => {
    // Not a failure -- it is the point. --text-faint is for hairline
    // numerals and inactive marks. If someone lightens it far enough to
    // pass, that is a decision worth making on purpose rather than by
    // nudging a hex, and this test is where the conversation happens.
    expect(contrast(token("text-faint"), GROUNDS.ground)).toBeLessThan(AA_BODY);
  });
});

describe("the ground levels stay ordered", () => {
  it("runs inset darker than base, and base darker than raised", () => {
    expect(luminance(GROUNDS["ground-inset"])).toBeLessThan(luminance(GROUNDS.ground));
    expect(luminance(GROUNDS.ground)).toBeLessThan(luminance(GROUNDS["ground-raised"]));
  });
});
