import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { destinations } from "@/content/destinations";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

/**
 * A 404 that is a junction rather than a dead end. Whatever someone was
 * looking for, every destination is one click away and the professional
 * routes are named explicitly.
 */
export default function NotFound() {
  return (
    <Container width="reading" className="py-24 sm:py-32">
      <Stamp>No signal</Stamp>
      <h1 className="mt-6 font-display text-display-lg leading-display tracking-display text-primary">
        Nothing at these coordinates.
      </h1>
      <p className="mt-4 text-body-lg text-secondary">
        The page does not exist — but everything else still does.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink href="/" variant="primary">
          Back to start
        </ButtonLink>
        <ButtonLink href="/profile" variant="secondary">
          Profile
        </ButtonLink>
        <ButtonLink href="/projects" variant="secondary">
          Projects
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
                <span className="font-mono text-label text-faint tabular">
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
