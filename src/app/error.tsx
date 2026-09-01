"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { destinations } from "@/content/destinations";

/**
 * The route failed. Everything around it did not.
 *
 * This renders inside the root layout, so the rail, the map, the
 * atmosphere and the footer all survive -- a visitor who hits this
 * still has every destination one click away, which is the same stance
 * not-found.tsx takes and the reason both pages are junctions rather
 * than dead ends.
 *
 * `error.message` is deliberately not printed. In production React
 * replaces it with an opaque digest, so it would say nothing useful,
 * and a stack trace is not the voice of this site. The digest goes to
 * the console for whoever is actually debugging.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route] render failed", error);
  }, [error]);

  return (
    <Container width="reading" className="py-24 sm:py-32">
      <Stamp>Signal lost</Stamp>
      <h1 className="mt-6 font-display text-display-lg leading-display tracking-display text-primary">
        Something here failed to render.
      </h1>
      <p className="mt-4 text-body-lg text-secondary">
        Not the whole site — only this page. Try it again, or go somewhere
        that works.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button onClick={reset} variant="primary">
          Try again
        </Button>
        <ButtonLink href="/" variant="secondary">
          Back to start
        </ButtonLink>
        <ButtonLink href="/profile" variant="secondary">
          Profile
        </ButtonLink>
      </div>

      <nav aria-label="All destinations" className="mt-16">
        <p className="font-mono text-label uppercase tracking-label text-data">
          Everywhere else
        </p>
        <ol className="mt-4 border-t border-hairline">
          {destinations.map((d) => (
            <li key={d.id}>
              <Link
                href={d.href}
                className="group flex items-baseline gap-4 border-b border-hairline py-3 transition-colors dur-micro hover:bg-ground-raised"
              >
                <span className="font-mono text-label text-muted tabular">
                  {d.index}
                </span>
                <span className="font-display text-primary transition-colors dur-micro group-hover:text-signal">
                  {d.name}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </Container>
  );
}
