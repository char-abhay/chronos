"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The curiosity primitive.
 *
 * A closed Reveal shows only a label and a prompt. Clicking it opens.
 * That is where the interest comes from -- the act of uncovering --
 * rather than from explanatory paragraphs sitting there already open.
 *
 * Accessibility is not traded away for the effect:
 *   - it is a real <button> with aria-expanded and aria-controls
 *   - Enter, Space and tap all work
 *   - the content is in the DOM once opened, readable by screen readers
 *   - under reduced motion the height animation is skipped entirely
 *
 * `hint` is the closed-state teaser. Keep it short and slightly
 * withholding: it should make someone want to click, not summarise
 * what clicking would show.
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
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div
      className={cn(
        "group rounded-[2px] border transition-colors dur-ui",
        open
          ? "border-signal/40 bg-ground-raised"
          : "border-hairline hover:border-signal/40",
        className
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-4 p-5 text-start"
      >
        <span
          aria-hidden="true"
          className={cn(
            "mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-colors dur-ui",
            open ? "bg-signal" : "bg-[var(--text-faint)] group-hover:bg-signal"
          )}
        />

        <span className="flex-1">
          {meta ? (
            <span className="block font-mono text-label uppercase tracking-label text-data tabular">
              {meta}
            </span>
          ) : null}
          <span
            className={cn(
              "mt-1 block font-display text-body-lg transition-colors dur-ui",
              open ? "text-signal" : "text-primary"
            )}
          >
            {label}
          </span>
          {hint && !open ? (
            <span className="mt-1 block text-body-sm text-muted">{hint}</span>
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "mt-1 shrink-0 font-mono text-label transition-transform dur-ui",
            open ? "rotate-45 text-signal" : "text-faint"
          )}
        >
          +
        </span>
      </button>

      {/* Rendered only when open: nothing hidden-but-present for a screen
          reader to stumble into, and no wasted markup when closed. */}
      {open ? (
        <div id={id} className="border-t border-hairline px-5 pb-6 pt-5 ps-14">
          {children}
        </div>
      ) : null}
    </div>
  );
}
