import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { ButtonLink } from "@/components/ui/Button";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getDestination } from "@/content/destinations";
import { profile } from "@/content";

const destination = getDestination("future")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    "Abhay P is looking for an entry-level Software Developer or IT role. Email, GitHub, LinkedIn and resume.",
};

/**
 * Deliberately the sparsest page on the site. The point of this section
 * is that it has not happened yet, and a dense layout would contradict
 * that. Whitespace is doing the work.
 */
export default function NextPage() {
  return (
    <>
      <Arrival
        index={destination.index}
        name={destination.name}
        scale={destination.scale}
        hook={destination.hook}
      />

      <Container width="reading" className="pt-16 sm:pt-24">
        <p className="text-body-lg text-secondary">
          Looking for an entry-level Software Developer or IT role — somewhere
          to put this to work and keep building.
        </p>

        <div className="mt-16">
          <a
            href={"mailto:" + profile.email}
            className="font-display text-display-md leading-display tracking-display text-signal underline underline-offset-[8px] decoration-hairline transition-colors dur-micro hover:decoration-signal"
          >
            {profile.email}
          </a>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-body-sm">
          <li>
            <ExternalLink href={profile.links.github.href}>
              {profile.links.github.label}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={profile.links.linkedin.href}>
              {profile.links.linkedin.label}
            </ExternalLink>
          </li>
        </ul>

        <div className="mt-16 flex flex-wrap gap-4">
          <ButtonLink href="/contact" variant="primary">
            Send a message
          </ButtonLink>
          <ButtonLink href={profile.links.resume.href} variant="secondary">
            Resume (PDF)
          </ButtonLink>
        </div>

        <p className="mt-24 font-mono text-label uppercase tracking-label text-muted">
          This page is intentionally unfinished.
        </p>
      </Container>

      <Departure from="future" />
    </>
  );
}
