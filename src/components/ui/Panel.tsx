"use client";

import { useEffect, useId } from "react";
import { useEscapeKey } from "@/lib/a11y/useEscapeKey";
import { useFocusTrap } from "@/lib/a11y/useFocusTrap";
import { cn } from "@/lib/cn";

/**
 * Full-height overlay. Used by PROFILE and MAP.
 *
 * Everything a modal must do, done once here so no caller has to
 * remember it:
 *   - focus moves in on open and returns to the trigger on close
 *   - Tab is trapped inside while open
 *   - Escape closes
 *   - the background is inert to screen readers (aria-modal + role)
 *   - background scroll is locked
 *   - the close control is a real 44px button with a text label
 *
 * Content inside is plain document flow -- headings, lists, links. No
 * scroll narrative, no 3D, no animation beyond a short fade.
 */
export function Panel({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useFocusTrap<HTMLDivElement>(open);
  useEscapeKey(open, onClose);

  /* Chrome mounts three of these, driven by three independent booleans.
     A shared literal id would collide the moment two were open at once
     and silently break aria-labelledby for both. Must be called before
     the early return below, so it cannot sit next to its own usage. */
  const titleId = useId();

  // Lock background scroll while the panel is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop. Clicking it closes, but it is not the only way out:
          Escape and the close button both work, and it is aria-hidden
          so it never appears as a phantom control. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[var(--ground-scrim)]"
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute inset-0 overflow-y-auto",
          "plate-scrim border-s border-hairline",
          "sm:inset-y-0 sm:end-0 sm:start-auto sm:w-full sm:max-w-2xl"
        )}
      >
        <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-hairline plate-scrim px-6 py-4">
          <h2
            id={titleId}
            className="font-display text-display-sm leading-display tracking-display text-primary"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center",
              "rounded-[2px] border border-hairline text-secondary",
              "transition-colors dur-micro hover:border-signal hover:text-primary"
            )}
          >
            <span aria-hidden="true">&#10005;</span>
            <span className="sr-only">Close {title}</span>
          </button>
        </div>

        <div className="px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
