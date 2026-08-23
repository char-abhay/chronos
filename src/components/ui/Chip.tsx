import { cn } from "@/lib/cn";

/** Technology marker. Non-interactive: a chip is a label, not a filter. */
export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] border border-hairline",
        "px-2.5 py-1 font-mono text-label text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
