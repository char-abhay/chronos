import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Flat plate, hairline border, no shadow, no glass. Depth comes from
 * the background hierarchy, not from blur.
 *
 * Height is driven by content, never by a reserved link slot -- a
 * project with no repository must not display a visible hole.
 */
export function Card({
  href,
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn(
    "block rounded-[2px] border border-hairline bg-ground-raised p-6",
    "transition-colors dur-micro",
    href && "hover:border-signal/40 focus-visible:border-signal/40",
    className
  );

  if (!href) return <div className={classes}>{children}</div>;

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
