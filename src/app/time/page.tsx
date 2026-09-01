import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { InView } from "@/components/motion/InView";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Reveal } from "@/components/interactive/Reveal";
import {
  TimeScrubber,
  type TrackItem,
} from "@/components/interactive/TimeScrubber";
import { Chip } from "@/components/ui/Chip";
import { getDestination } from "@/content/destinations";
import { education, experience, profile, projectsOrdered } from "@/content";
import { spell, spellLower } from "@/lib/format/count";
import { years } from "@/lib/format/timeline";

const destination = getDestination("time")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    `${profile.name} — degree, internship and ${spellLower(projectsOrdered.length)} builds ` +
    `between ${years[0]} and ${years[years.length - 1]}, on one timeline.`,
};

/**
 * How long the degree ran, in years.
 *
 * Not years.length -- that is the number of calendar-year labels on the
 * axis, which is four for a span of 2023 to 2026 and would have made
 * both sentences below say "four" about a three-year degree. The axis
 * and the degree are different measurements that happen to share a
 * start; only one of them is what this prose is describing.
 */
const degreeYears =
  Number(education.dates.end ?? education.dates.start) -
  Number(education.dates.start);

/** Everything that has a date, as one set of tracks. */
function buildTracks(): TrackItem[] {
  return [
    {
      id: "education",
      label: education.qualification,
      meta: education.institution + " · " + education.location,
      start: education.dates.start,
      end: education.dates.end ?? education.dates.start,
      kind: "education",
      detail: "Major subjects: " + education.majorSubjects.join(" · "),
    },
    ...experience.map((role) => ({
      id: "role-" + role.organisation,
      label: role.role,
      meta: role.organisation + " · " + role.location,
      start: role.dates.start,
      end: role.dates.end ?? role.dates.start,
      kind: "internship" as const,
      detail: role.bullets[0],
      extra: role.bullets.slice(1),
    })),
    ...projectsOrdered.map((project) => ({
      id: project.slug,
      label: project.name,
      meta: project.dates.label,
      start: project.dates.start,
      end: project.dates.end ?? project.dates.start,
      kind: "build" as const,
      href: "/projects/" + project.slug,
      detail: project.what,
    })),
  ];
}

export default function TimePage() {
  const tracks = buildTracks();

  // Newest first for the written record below.
  const ordered = [...tracks].sort((a, b) => b.start.localeCompare(a.start));

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
            Drag across {spellLower(degreeYears)} years. The long bar is the
            degree; everything else happened inside it.
          </p>
        </InView>

        <InView delay={100} className="mt-10">
          <TimeScrubber items={tracks} />
        </InView>
      </Container>

      {/* The complete written record. Works with no JavaScript, and is
          what a screen reader or a printout gets. */}
      <Container className="pt-20 sm:pt-28">
        <InView>
          <h2 className="font-mono text-label uppercase tracking-label text-data">
            The full record
          </h2>
        </InView>

        <ol className="mt-6 flex flex-col gap-3">
          {ordered.map((item, i) => {
            const project = projectsOrdered.find((p) => p.slug === item.id);
            return (
              <li key={item.id}>
                <InView delay={Math.min(i * 50, 250)}>
                  <Reveal
                    label={item.label}
                    meta={item.meta}
                    hint={
                      item.kind === "internship"
                        ? "The only outside assessment on this site."
                        : item.kind === "education"
                          ? spell(degreeYears) +
                            " years. One of the subjects stuck."
                          : undefined
                    }
                  >
                    <div className="text-secondary">
                      {item.detail ? <p>{item.detail}</p> : null}

                      {project ? (
                        <>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.technologies.map((t) => (
                              <Chip key={t}>{t}</Chip>
                            ))}
                          </div>
                          <p className="mt-4 text-body-sm">
                            <Link
                              href={"/projects/" + project.slug}
                              className="text-signal underline underline-offset-4 decoration-hairline hover:decoration-signal"
                            >
                              Open the full build →
                            </Link>
                          </p>
                        </>
                      ) : null}

                      {/* From the item, not from experience[0]. This
                          sits inside a map over every internship, so
                          indexing the source array meant a second role
                          would have rendered the first one's
                          achievements under its own heading. */}
                      {item.extra?.map((b) => (
                        <p key={b} className="mt-3 text-body-sm">
                          {b}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </InView>
              </li>
            );
          })}
        </ol>
      </Container>

      <Departure from="time" />
    </>
  );
}
