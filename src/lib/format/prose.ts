/**
 * Small joins for prose assembled out of record values.
 *
 * Both of these exist because interpolating a real name into a written
 * sentence is not string concatenation. The employer on record is
 * "EduPhoenix Solutions Pvt. Ltd." -- a value that already ends in a
 * full stop -- so a template ending `at ${organisation}.` produced
 * "Pvt. Ltd.." in the meta description of six pages. The fix belongs
 * here rather than in each sentence, because the next value that ends
 * in a period will not announce itself.
 */

/** Ends a sentence without doubling a full stop the value already has. */
export function endSentence(text: string): string {
  return /[.!?]$/.test(text.trim()) ? text.trim() : text.trim() + ".";
}

/** ["a","b","c"] -> "a, b and c". Serial comma omitted, as the site writes. */
export function listOut(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return items[0] + " and " + items[1];
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}
