import { describe, expect, it } from "vitest";
import { plural, spell, spellLower } from "@/lib/format/count";
import { endSentence, listOut } from "@/lib/format/prose";

describe("spell", () => {
  it("writes small numbers as words, the way the site writes them", () => {
    expect(spell(0)).toBe("Zero");
    expect(spell(1)).toBe("One");
    expect(spell(5)).toBe("Five");
    expect(spell(12)).toBe("Twelve");
  });

  it("hands over to digits past twelve", () => {
    expect(spell(13)).toBe("13");
    expect(spell(40)).toBe("40");
  });

  it("lowercases for mid-sentence use", () => {
    expect(spellLower(5)).toBe("five");
    expect(spellLower(13)).toBe("13");
  });

  it("does not return undefined for a count off the end of the table", () => {
    // WORDS[n] ?? String(n) is the whole guard. A page interpolating an
    // undefined here would read "undefined builds" rather than throw.
    for (const n of [-1, 12.5, 99, 1000]) {
      expect(typeof spell(n)).toBe("string");
      expect(spell(n)).not.toContain("undefined");
    }
  });
});

describe("plural", () => {
  it("keeps a derived count from reading as a typo", () => {
    expect(plural(1)).toBe("");
    expect(plural(0)).toBe("s");
    expect(plural(2)).toBe("s");
  });
});

describe("endSentence", () => {
  it("adds the full stop a sentence needs", () => {
    expect(endSentence("Built on the job")).toBe("Built on the job.");
  });

  it("does not double one the value already carries", () => {
    // The reason this function exists: the employer on record is
    // "EduPhoenix Solutions Pvt. Ltd." and a template ending in a period
    // shipped "Pvt. Ltd.." to the meta description of six pages.
    expect(endSentence("Interned at EduPhoenix Solutions Pvt. Ltd.")).toBe(
      "Interned at EduPhoenix Solutions Pvt. Ltd."
    );
  });

  it("leaves other terminal punctuation alone", () => {
    expect(endSentence("Where next?")).toBe("Where next?");
    expect(endSentence("Not yet!")).toBe("Not yet!");
  });

  it("trims before deciding", () => {
    expect(endSentence("  Five builds  ")).toBe("Five builds.");
    expect(endSentence("Five builds.  ")).toBe("Five builds.");
  });
});

describe("listOut", () => {
  it("joins the way the site writes a list", () => {
    expect(listOut(["a", "b", "c"])).toBe("a, b and c");
    expect(listOut(["a", "b"])).toBe("a and b");
    expect(listOut(["a"])).toBe("a");
  });

  it("omits the serial comma", () => {
    expect(listOut(["a", "b", "c"])).not.toContain(", and");
  });

  it("returns an empty string rather than undefined for nothing", () => {
    expect(listOut([])).toBe("");
  });
});
