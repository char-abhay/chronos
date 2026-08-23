import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary";

/**
 * All five interaction states are defined: rest, hover, focus-visible,
 * active, disabled. focus-visible comes from the global rule in
 * globals.css and is designed first, never derived from hover.
 *
 * Minimum 44x44 hit area everywhere -- including desktop, because a
 * small target is a small target regardless of pointer type.
 *
 * No gradients, no glow. Warm border = you can act on this.
 */
const base = cn(
  "inline-flex min-h-11 items-center justify-center gap-2",
  "rounded-[2px] px-5 py-2.5",
  "font-body text-body-sm",
  "transition-colors dur-micro",
  "disabled:cursor-not-allowed disabled:opacity-45"
);

const variants: Record<Variant, string> = {
  primary: cn(
    "border border-signal text-signal",
    "bg-[color-mix(in_srgb,var(--signal)_10%,transparent)]",
    "hover:bg-[color-mix(in_srgb,var(--signal)_18%,transparent)]",
    "active:bg-[color-mix(in_srgb,var(--signal)_26%,transparent)]"
  ),
  secondary: cn(
    "border border-hairline text-secondary",
    "hover:border-signal hover:text-primary",
    "active:border-signal"
  ),
  tertiary: cn(
    "border border-transparent px-0 text-secondary underline",
    "underline-offset-[6px] decoration-hairline",
    "hover:text-primary hover:decoration-signal"
  ),
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "secondary",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/**
 * A link that looks like a button. Stays an anchor so middle-click,
 * open-in-new-tab and the browser's own affordances keep working.
 */
export function ButtonLink({
  href,
  external,
  variant = "secondary",
  className,
  children,
}: CommonProps & { href: string; external?: boolean }) {
  const classes = cn(base, variants[variant], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
