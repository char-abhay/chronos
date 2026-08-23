import { cn } from "@/lib/cn";

/**
 * The mandatory backdrop for text sitting over an animated layer.
 *
 * This component exists to make the rule enforceable rather than
 * remembered: body text never sits directly on moving atmosphere.
 */
export function ContentPlate({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "plate-scrim rounded-[2px] border border-hairline p-6 sm:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
