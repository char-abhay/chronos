import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { InView } from "@/components/motion/InView";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Reveal } from "@/components/interactive/Reveal";
import { getDestination } from "@/content/destinations";
import { profile, projectsOrdered } from "@/content";
import { endSentence, listOut } from "@/lib/format/prose";

const destination = getDestination("black-holes")!;

/* Named from the record, not from a literal. The page below already
   filters for every project carrying challenges, so hard-coding one
   project's name here meant the description could go on crediting a
   single build after a second one had joined it. */
const challengeProjects = projectsOrdered.filter(
  (project) => project.challenges && project.challenges.length > 0
);

export const metadata: Metadata = {
  title: destination.name,
  description:
    `The hard parts — the technical problems ${profile.name} had to solve ` +
    endSentence(
      "while building " + listOut(challengeProjects.map((p) => p.name))
    ),
};

/**
 * The challenges page. Everything here comes from a real project's
 * architecture, and every challenge is attributed to the build it came
 * from -- there is no generic "I am a problem solver" filler.
 */
export default function PressurePage() {
  const withChallenges = challengeProjects;

  return (
    <>
      <Arrival
        index={destination.index}
        name={destination.name}
        scale={destination.scale}
        hook={destination.hook}
      />

      <Container className="pt-12 sm:pt-16">
        <InView>
          <p className="max-w-reading text-body-lg text-secondary">
            Every build has a part that resists. These are the ones that took
            the longest to get right.
          </p>
        </InView>

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
                <InView key={challenge.title} delay={Math.min(i * 70, 280)}>
                  <Reveal label={challenge.title} meta={"0" + String(i + 1)}>
                    <p className="text-secondary">{challenge.body}</p>
                  </Reveal>
                </InView>
              ))}
            </div>
          </section>
        ))}
      </Container>

      <Departure from="black-holes" />
    </>
  );
}
