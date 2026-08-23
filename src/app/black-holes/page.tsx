import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Reveal } from "@/components/interactive/Reveal";
import { getDestination } from "@/content/destinations";
import { projectsOrdered } from "@/content";

const destination = getDestination("black-holes")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    "The hard parts — the technical problems Abhay P had to solve while building dVoting.",
};

/**
 * The challenges page. Everything here comes from a real project's
 * architecture, and every challenge is attributed to the build it came
 * from -- there is no generic "I am a problem solver" filler.
 */
export default function PressurePage() {
  const withChallenges = projectsOrdered.filter(
    (p) => p.challenges && p.challenges.length > 0
  );

  return (
    <>
      <Arrival
        index={destination.index}
        name={destination.name}
        scale={destination.scale}
        hook={destination.hook}
      />

      <Container className="pt-12 sm:pt-16">
        <p className="max-w-reading text-body-lg text-secondary">
          Every build has a part that resists. These are the ones that took
          the longest to get right.
        </p>

        {withChallenges.map((project) => (
          <section
            key={project.slug}
            aria-labelledby={project.slug + "-challenges"}
            className="mt-12"
          >
            <h2
              id={project.slug + "-challenges"}
              className="font-mono text-label uppercase tracking-label text-data"
            >
              From{" "}
              <Link
                href={"/projects/" + project.slug}
                className="text-signal underline underline-offset-4 decoration-hairline hover:decoration-signal"
              >
                {project.name}
              </Link>
            </h2>

            <div className="mt-6 flex flex-col gap-3">
              {project.challenges!.map((challenge, i) => (
                <Reveal
                  key={challenge.title}
                  label={challenge.title}
                  meta={"0" + String(i + 1)}
                >
                  <p className="text-secondary">{challenge.body}</p>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </Container>

      <Departure from="black-holes" />
    </>
  );
}
