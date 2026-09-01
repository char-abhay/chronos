/**
 * Counts, spelled the way this site writes them.
 *
 * The prose says "Five builds", not "5 builds", and those numbers used
 * to be typed by hand directly above lists that derive themselves. An
 * <h1> reading "Five builds" over six cards is worse than never having
 * counted at all -- the reader trusts the heading and stops reading.
 *
 * Words run out at twelve and digits take over, which is the usual
 * editorial rule and is far past anything this record will reach soon.
 */
const WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];

/** 5 -> "Five". For the start of a sentence or a standalone label. */
export function spell(n: number): string {
  return WORDS[n] ?? String(n);
}

/** 5 -> "five". For mid-sentence. */
export function spellLower(n: number): string {
  return spell(n).toLowerCase();
}

/** 1 -> "", 2 -> "s". Keeps a derived count from reading as a typo. */
export function plural(n: number): string {
  return n === 1 ? "" : "s";
}
