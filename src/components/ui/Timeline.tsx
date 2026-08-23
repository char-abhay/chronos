import { cn } from "@/lib/cn";

/**
 * A single hairline rule with tick marks. This is the MY STORY spine
 * and the education/experience presentation.
 *
 * Renders an ordered list, because it IS ordered -- screen reader users
 * get "list, 7 items" and can navigate it as a structure.
 */
export function Timeline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ol className={cn("relative ms-3 border-s border-hairline", className)}>
      {children}
    </ol>
  );
}

export function TimelineItem({
  marker,
  title,
  children,
  className,
  level = 3,
}: {
  marker?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  /** Heading level for the entry title. Set 2 when the timeline is the
      page's top-level content, so the h1 -> h3 skip does not happen. */
  level?: 2 | 3;
}) {
  const Tag = ("h" + level) as "h2" | "h3";
  return (
    <li className={cn("relative ps-8 pb-10 last:pb-0", className)}>
      <span
        aria-hidden="true"
        className="absolute -start-px top-2 h-px w-4 bg-[var(--hairline-strong)]"
      />
      {marker ? (
        <p className="font-mono text-label uppercase tracking-label text-data tabular">
          {marker}
        </p>
      ) : null}
      <Tag className="mt-2 font-display text-body-lg text-primary">{title}</Tag>
      {children ? (
        <div className="mt-2 max-w-reading text-secondary">{children}</div>
      ) : null}
    </li>
  );
}
