"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

export type Subject = {
  id: string;
  name: string;
  /** Marked on the one that became the degree specialisation. */
  specialisation?: boolean;
  /** What this subject actually turned into. Never empty. */
  outcomes: {
    kind: "build" | "study";
    label: string;
    meta?: string;
    href?: string;
  }[];
};

/**
 * Three subjects were studied. Click one to see what it became.
 *
 * The honest case is the interesting one: Blockchain and AI each
 * produced a build, and Cloud Computing -- the actual specialisation --
 * produced coursework and a certification but no project yet. Rather
 * than hide that behind an empty state, the cluster shows the real
 * study that exists. Nothing is invented to balance the three.
 *
 * The announcement is one sentence in a visually-hidden live region, not
 * the whole plate. Marking the plate itself live meant picking a subject
 * re-read every heading, link and meta line in it; the summary says what
 * changed and leaves the detail to be read at the user's own pace.
 */
export function SubjectTrace({ subjects }: { subjects: Subject[] }) {
  const [active, setActive] = useState<string>(subjects[0]?.id ?? "");
  const current = subjects.find((s) => s.id === active);

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-wrap gap-2">
        {subjects.map((subject) => {
          const isActive = subject.id === active;
          return (
            <li key={subject.id}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(subject.id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-[2px] border px-4",
                  "text-body-sm transition-colors dur-micro",
                  isActive
                    ? "border-signal bg-[color-mix(in_srgb,var(--signal)_12%,transparent)] text-signal"
                    : "border-hairline text-secondary hover:border-signal hover:text-primary"
                )}
              >
                {subject.name}
                {subject.specialisation ? (
                  <span
                    className={cn(
                      "font-mono text-label uppercase tracking-label",
                      isActive ? "text-signal" : "text-muted"
                    )}
                  >
                    spec.
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="sr-only" aria-live="polite">
        {current
          ? current.name +
            ": " +
            current.outcomes.map((outcome) => outcome.label).join(", ")
          : ""}
      </p>

      <div className="min-h-40 rounded-[2px] border border-hairline bg-ground-raised p-6">
        {current ? (
          <>
            <p className="font-mono text-label uppercase tracking-label text-data">
              {current.name}
              {current.specialisation ? (
                <span className="ms-3 text-muted">degree specialisation</span>
              ) : null}
            </p>

            <ul className="mt-5 flex flex-col gap-4">
              {current.outcomes.map((outcome) => (
                <li key={outcome.label}>
                  <p className="font-mono text-label uppercase tracking-label text-muted">
                    {outcome.kind === "build" ? "Became" : "Studied"}
                  </p>
                  {outcome.href ? (
                    <Link
                      href={outcome.href}
                      className="mt-1 block font-display text-body-lg text-signal underline underline-offset-4 decoration-hairline hover:decoration-signal"
                    >
                      {outcome.label}
                    </Link>
                  ) : (
                    <p className="mt-1 font-display text-body-lg text-primary">
                      {outcome.label}
                    </p>
                  )}
                  {outcome.meta ? (
                    <p className="mt-0.5 text-body-sm text-muted">
                      {outcome.meta}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
