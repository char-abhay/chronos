import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Reveal } from "@/components/interactive/Reveal";
import { Chip } from "@/components/ui/Chip";
import { getDestination } from "@/content/destinations";
import { education, experience, projectsOrdered } from "@/content";

const destination = getDestination("time")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    "Abhay P — everything, in the order it happened. Degree, internship and five builds between 2023 and 2026.",
};

/** One ordered list of everything that actually happened, oldest last. */
function buildEvents() {
  const events = [
    {
      key: "degree",
      when: education.dates.label,
      sortKey: "2023-00",
      title: education.qualification,
      hint: "Where the three years start.",
      body: (
        <div className="text-secondary">
          <p>
            {education.institution} · {education.location}
          </p>
          <p className="mt-3 text-body-sm text-muted">
            Major subjects: {education.majorSubjects.join(" · ")}
          </p>
        </div>
      ),
    },
    ...experience.map((role) => ({
      key: role.organisation,
      when: role.dates.label,
      sortKey: role.dates.start,
      title: role.role,
      hint: "The only outside assessment on this page.",
      body: (
        <div className="text-secondary">
          <p>
            {role.organisation} · {role.location}
          </p>
          <ul className="mt-4 flex list-disc flex-col gap-2 ps-5 text-body-sm marker:text-faint">
            {role.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      ),
    })),
    ...projectsOrdered.map((project) => ({
      key: project.slug,
      when: project.dates.label,
      sortKey: project.dates.start,
      title: project.name,
      hint:
        project.context === "internship"
          ? "Built on the job, not for a grade."
          : undefined,
      body: (
        <div className="text-secondary">
          <p>{project.what}</p>
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
        </div>
      ),
    })),
  ];

  // Newest first: the most recent work is what a reader wants first.
  return events.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}

export default function TimePage() {
  const events = buildEvents();

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
          Seven entries between 2023 and 2026. Open any of them.
        </p>

        <ol className="mt-10 flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.key}>
              <Reveal label={event.title} meta={event.when} hint={event.hint}>
                {event.body}
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>

      <Departure from="time" />
    </>
  );
}
