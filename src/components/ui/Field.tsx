import { cn } from "@/lib/cn";

/**
 * Form field with a visible, persistent label.
 *
 * Placeholder-as-label is banned: it disappears the moment someone
 * starts typing, which is exactly when they most need it, and it fails
 * for screen readers and for anyone who gets interrupted mid-form.
 *
 * Errors are wired with aria-describedby and always carry text, never
 * colour alone.
 */
export function Field({
  id,
  label,
  type = "text",
  required,
  autoComplete,
  error,
  multiline,
  className,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  multiline?: boolean;
  className?: string;
}) {
  const errorId = id + "-error";
  const control = cn(
    "w-full rounded-[2px] border bg-ground-inset px-3 py-2.5",
    "font-body text-body text-primary",
    "transition-colors dur-micro",
    error ? "border-[var(--status-error)]" : "border-hairline",
    "hover:border-[var(--hairline-strong)]"
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-body-sm text-secondary">
        {label}
        {required ? (
          <span className="ms-1 text-data" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={control}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={control}
        />
      )}

      {error ? (
        <p id={errorId} className="text-body-sm text-[var(--status-error)]">
          <span aria-hidden="true">! </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
