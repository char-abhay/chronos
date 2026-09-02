"use client";

import { useId, useRef, useState } from "react";
import { useEscapeKey } from "@/lib/a11y/useEscapeKey";
import { cn } from "@/lib/cn";

/**
 * Never hover-only.
 *
 * A hover tooltip is invisible on every touch device and to every
 * keyboard user, which is most of the audience for a portfolio. This is
 * a real <button> that toggles a popover, so it works with tap, click,
 * Enter, Space and Escape identically.
 *
 * Used for L2 disclosures on inline terms.
 */
export function Tooltip({
  label,
  children,
  className,
}: {
  /** The trigger text, e.g. an inline term. */
  label: string;
  /** The explanation. */
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapper = useRef<HTMLSpanElement>(null);

  useEscapeKey(open, () => setOpen(false));

  // Close when focus leaves the whole trigger + popover group.
  function handleBlur(event: React.FocusEvent<HTMLSpanElement>) {
    if (!wrapper.current?.contains(event.relatedTarget as Node)) {
      setOpen(false);
    }
  }

  return (
    <span
      ref={wrapper}
      onBlur={handleBlur}
      className={cn("relative inline-block", className)}
    >
      <button
        type="button"
        aria-expanded={open}
        // Only while there is something to control. The popover below is
        // rendered on open, so a constant aria-controls spent most of its
        // life pointing at an id that was not in the document -- a broken
        // IDREF, which ARIA treats as an error and which is worse than
        // the attribute simply being absent. aria-expanded already says
        // what state the trigger is in.
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline items-center text-start underline decoration-dotted",
          "underline-offset-[4px] decoration-[var(--data)]",
          "transition-colors dur-micro hover:text-primary"
        )}
      >
        {label}
      </button>

      {open ? (
        <span
          id={id}
          role="note"
          className={cn(
            "absolute start-0 top-full z-20 mt-2 block w-72 max-w-[80vw]",
            "rounded-[2px] border border-hairline bg-ground-raised p-4",
            "text-body-sm text-secondary shadow-none"
          )}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
