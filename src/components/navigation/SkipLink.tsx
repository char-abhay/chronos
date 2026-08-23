/**
 * The first tab stop on every page. Hidden until focused.
 *
 * With a persistent nav rail, a keyboard user would otherwise tab
 * through eight destinations plus two controls before reaching the
 * content, on every single page.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={[
        "sr-only focus:not-sr-only",
        "focus:fixed focus:start-4 focus:top-4 focus:z-[100]",
        "focus:inline-flex focus:min-h-11 focus:items-center",
        "focus:rounded-[2px] focus:border focus:border-signal",
        "focus:bg-ground focus:px-4 focus:text-signal",
      ].join(" ")}
    >
      Skip to content
    </a>
  );
}
