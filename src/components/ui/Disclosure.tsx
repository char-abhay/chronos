import { cn } from "@/lib/cn";

/**
 * Progressive disclosure (L2 / L3 science content).
 *
 * Built on native <details>/<summary> deliberately: it works with zero
 * JavaScript, its keyboard behaviour is already correct, screen readers
 * announce the expanded state without any ARIA, and it cannot get stuck
 * in a broken state if a script fails to load.
 *
 * A custom button + aria-expanded version would be more animatable and
 * strictly worse on every axis that matters here.
 */
export function Disclosure({
  summary,
  children,
  className,
}: {
  summary: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details
      className={cn(
        "group border-t border-hairline py-4",
        "[&_summary::-webkit-details-marker]:hidden",
        className
      )}
    >
      <summary
        className={cn(
          "flex min-h-11 cursor-pointer list-none items-center justify-between gap-4",
          "font-mono text-label uppercase tracking-label text-data",
          "transition-colors dur-micro hover:text-primary"
        )}
      >
        {summary}
        <span
          aria-hidden="true"
          className="text-faint transition-transform dur-micro group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 max-w-reading text-secondary">{children}</div>
    </details>
  );
}
