import { cn } from "@/lib/cn";

/** Max-width wrapper. Prose columns use `reading` to hold the measure. */
export function Container({
  children,
  width = "default",
  className,
}: {
  children: React.ReactNode;
  width?: "default" | "reading";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8",
        width === "reading" ? "max-w-reading" : "max-w-chronos",
        className
      )}
    >
      {children}
    </div>
  );
}
