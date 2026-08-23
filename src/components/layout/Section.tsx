import { cn } from "@/lib/cn";

/**
 * A labelled region. Always renders a real heading and wires
 * aria-labelledby, so landmark navigation works without extra thought.
 * Generous vertical rhythm: negative space is how scale is communicated
 * at zero performance cost.
 */
export function Section({
  id,
  title,
  titleVisible = true,
  children,
  className,
}: {
  id: string;
  title: string;
  titleVisible?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = id + "-heading";
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-14 sm:py-24", className)}
    >
      <h2
        id={headingId}
        className={cn(
          "font-display text-display-sm leading-display tracking-display text-primary",
          !titleVisible && "sr-only"
        )}
      >
        {title}
      </h2>
      <div className={cn(titleVisible && "mt-6")}>{children}</div>
    </section>
  );
}
