import { cn } from "@/lib/cn";

/**
 * Monospace coordinate/scale marker.
 *
 * Decorative rank by design: --text-faint is below the contrast floor,
 * so a Stamp must never be the only place a piece of information
 * appears. Anything it says is also said in a real heading.
 */
export function Stamp({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-label uppercase tracking-label text-faint",
        className
      )}
    >
      {children}
    </p>
  );
}
