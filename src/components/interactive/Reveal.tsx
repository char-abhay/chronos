import { cn } from "@/lib/cn";

/**
 * The curiosity primitive.
 *
 * A closed Reveal shows only a label and a prompt. Opening it is where
 * the interest comes from -- the act of uncovering -- rather than from
 * explanatory paragraphs sitting there already open.
 *
 * Native <details>/<summary>, for the reasons already written down in
 * Disclosure.tsx and not worth restating: the keyboard behaviour is the
 * browser's, the expanded state is announced without any ARIA of ours,
 * and no failed script can strand it half-open.
 *
 * This was a <button> with useState and aria-expanded -- precisely the
 * shape Disclosure's docblock calls "strictly worse on every axis that
 * matters here" -- and the cost was not theoretical. The server renders
 * the closed state, so `{open ? children : null}` put the children in
 * no document at all. Five pages served their headings and nothing
 * underneath: every project's what and why, the certifications, the
 * tool chips, the challenge write-ups, the entire written record on
 * /time. /black-holes shipped fewer characters than the page the README
 * calls the sparsest on the site, and the print rules in globals.css
 * that force a <details> open for paper had no markup to reach. The
 * README calls working with JavaScript off a non-negotiable; this is
 * the file that decided whether that was true.
 *
 * The content is now in the DOM from the first byte and collapsed by
 * the browser, which keeps it out of the accessibility tree while
 * closed -- the one property the old version did get right.
 *
 * Every open/closed style is a CSS variant rather than a branch. Where
 * a hover and an open style set the same value there is no ordering
 * hazard, which is why both are allowed to say border-signal/40.
 */
export function Reveal({
  label,
  hint,
  meta,
  children,
  defaultOpen = false,
  className,
}: {
  label: string;
  hint?: string;
  meta?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      // `|| undefined` rather than the bare boolean: passing open={false}
      // hands React an attribute to keep managing, and a re-render from
      // an ancestor could then slam a reader's open panel shut. Omitted
      // entirely, the element is the browser's alone.
      open={defaultOpen || undefined}
      className={cn(
        "group rounded-[2px] border border-hairline transition-colors dur-ui",
        "hover:border-signal/40 open:border-signal/40 open:bg-ground-raised",
        // Safari draws its own triangle from a pseudo-element that
        // list-none does not reach.
        "[&_summary::-webkit-details-marker]:hidden",
        className
      )}
    >
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 text-start">
        <span
          aria-hidden="true"
          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-faint)] transition-colors dur-ui group-hover:bg-signal group-open:bg-signal"
        />

        <span className="flex-1">
          {meta ? (
            <span className="block font-mono text-label uppercase tracking-label text-data">
              {meta}
            </span>
          ) : null}
          <span className="mt-1 block font-display text-body-lg text-primary transition-colors dur-ui group-open:text-signal">
            {label}
          </span>
          {hint ? (
            <span className="mt-1 block text-body-sm text-muted group-open:hidden">
              {hint}
            </span>
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className="mt-1 shrink-0 font-mono text-label text-faint transition-transform dur-ui group-open:rotate-45 group-open:text-signal"
        >
          +
        </span>
      </summary>

      <div className="border-t border-hairline px-5 pb-6 pt-5 ps-14">
        {children}
      </div>
    </details>
  );
}
