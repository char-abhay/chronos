import { cn } from "@/lib/cn";

/**
 * Every external link announces itself to screen readers. The visual
 * marker is the arrow; the spoken marker is the sr-only text.
 */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-secondary underline",
        "underline-offset-[4px] decoration-hairline",
        "transition-colors dur-micro hover:text-primary hover:decoration-signal",
        className
      )}
    >
      {children}
      <span aria-hidden="true" className="text-faint">
        &#8599;
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
