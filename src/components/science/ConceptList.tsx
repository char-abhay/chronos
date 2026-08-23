import { Disclosure } from "@/components/ui/Disclosure";
import type { ScienceConcept } from "@/content/schema";

/**
 * Progressive disclosure, L1 -> L2 -> L3 (plan Section 15).
 *
 * L1 and L2 are always visible: the headline plus an accessible
 * explanation. L3 and the caveat are behind a disclosure, because depth
 * should be available without being imposed.
 *
 * Sources are always shown. If a claim is worth making it is worth
 * attributing, and a visible citation is what stops science writing
 * from drifting into confident-sounding invention.
 */
export function ConceptList({ concepts }: { concepts: ScienceConcept[] }) {
  return (
    <div className="flex flex-col gap-16">
      {concepts.map((concept) => (
        <article key={concept.id}>
          <h2 className="max-w-reading font-display text-display-sm leading-display tracking-display text-primary">
            {concept.l1}
          </h2>

          <p className="mt-4 max-w-reading text-body-lg text-secondary">
            {concept.l2}
          </p>

          <div className="mt-6 max-w-reading">
            <Disclosure summary="Go deeper">
              <p>{concept.l3}</p>

              {concept.caveat ? (
                <p className="mt-4 border-s-2 border-[var(--status-warn)] ps-4 text-body-sm text-muted">
                  <span className="font-mono text-label uppercase tracking-label text-[var(--status-warn)]">
                    Limits
                  </span>
                  <span className="mt-1 block">{concept.caveat}</span>
                </p>
              ) : null}

              <div className="mt-6">
                <p className="font-mono text-label uppercase tracking-label text-faint">
                  Sources
                </p>
                <ul className="mt-2 flex flex-col gap-1 text-body-sm text-muted">
                  {concept.sources.map((source) => (
                    <li key={source.label}>
                      {source.href ? (
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:text-secondary hover:decoration-signal"
                        >
                          {source.label}
                        </a>
                      ) : (
                        source.label
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Disclosure>
          </div>
        </article>
      ))}
    </div>
  );
}
