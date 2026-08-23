import type { Metadata } from "next";
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
import { education, experience, projectsOrdered } from "@/content";

const destination = getDestination("time")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    "Abhay P — degree, internship and five builds between 2023 and 2026, on one timeline.",
};

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
            Drag across three years. The long bar is the degree; everything
            else happened inside it.
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
                          ? "Three years. One of the subjects stuck."
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
                            <a
                              href={"/projects/" + project.slug}
                              className="text-signal underline underline-offset-4 decoration-hairline hover:decoration-signal"
                            >
                              Open the full build →
                            </a>
                          </p>
                        </>
                      ) : null}

                      {item.kind === "internship"
                        ? experience[0].bullets.slice(1).map((b) => (
                            <p key={b} className="mt-3 text-body-sm">
                              {b}
                            </p>
                          ))
                        : null}
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
