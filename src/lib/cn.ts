/**
 * Join class names, dropping anything falsy.
 * Deliberately tiny -- this project does not need clsx as a dependency.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
