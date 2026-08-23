import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { InView } from "@/components/motion/InView";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Reveal } from "@/components/interactive/Reveal";
import {
  SubjectTrace,
  type Subject,
} from "@/components/interactive/SubjectTrace";
import { Chip } from "@/components/ui/Chip";
import { getDestination } from "@/content/destinations";
import {
  certifications,
  education,
  getProject,
  isKnown,
  profile,
  skillGroups,
} from "@/content";

const destination = getDestination("earth")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    "Where Abhay P started — Kasaragod, Kerala to CMR University, Bangalore. BCA specialising in Cloud Computing.",
};

/**
 * Each subject maps only to what the data actually supports:
 *   Blockchain -> dVoting            (its own technology list)
 *   AI         -> AI Chatbot         (its own technology list)
 *   Cloud      -> coursework + cert  (no project exists yet)
 * Nothing is invented to make the three look balanced.
 */
function buildSubjects(): Subject[] {
  const cloudSkills = skillGroups.find((g) => g.id === "cloud");
  const cloudCert = certifications.find((c) => c.title === "Cloud Computing");
  const dvoting = getProject("dvoting");
  const chatbot = getProject("ai-chatbot");

  return [
    {
      id: "cloud",
      name: "Cloud Computing",
      specialisation: true,
      outcomes: [
        ...(cloudSkills
          ? cloudSkills.items.map((item) => ({
              kind: "study" as const,
              label: item,
            }))
          : []),
        ...(cloudCert
          ? [
              {
                kind: "study" as const,
                label: cloudCert.title,
                meta:
                  (isKnown(cloudCert.provider) ? cloudCert.provider + " · " : "") +
                  cloudCert.format,
              },
            ]
          : []),
      ],
    },
    {
      id: "blockchain",
      name: "Blockchain",
      outcomes: dvoting
        ? [
            {
              kind: "build" as const,
              label: dvoting.name,
              meta: dvoting.dates.label + " · " + dvoting.technologies.join(" · "),
              href: "/projects/" + dvoting.slug,
            },
          ]
        : [],
    },
    {
      id: "ai",
      name: "Artificial Intelligence",
      outcomes: chatbot
        ? [
            {
              kind: "build" as const,
              label: chatbot.name,
              meta: chatbot.dates.label + " · " + chatbot.technologies.join(" · "),
              href: "/projects/" + chatbot.slug,
            },
          ]
        : [],
    },
  ];
}

export default function EarthPage() {
  const subjects = buildSubjects();

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
            Home is {profile.location}. The degree meant moving south to{" "}
            {education.location.split(",")[0]}.
          </p>
        </InView>

        {/* The move, as two points. */}
        <InView delay={100}>
          <div className="mt-10 flex flex-wrap items-center gap-4 font-mono text-label uppercase tracking-label">
            <span className="text-secondary">{profile.location}</span>
            <span aria-hidden="true" className="text-faint">
              ──────▶
            </span>
            <span className="text-signal">{education.location}</span>
          </div>
        </InView>

        <InView delay={180}>
          <div className="mt-12 border-t border-hairline pt-8">
            <p className="font-display text-display-sm leading-display tracking-display text-primary">
              {education.qualification}
            </p>
            <p className="mt-2 text-secondary">
              {education.institution} · {education.location}
            </p>
            <p className="mt-1 font-mono text-label text-data tabular">
              {education.dates.label}
            </p>
          </div>
        </InView>
      </Container>

      {/* ---------- WHAT EACH SUBJECT BECAME ---------- */}
      <Container className="pt-16 sm:pt-24">
        <InView>
          <h2 className="font-mono text-label uppercase tracking-label text-data">
            Three subjects
          </h2>
        </InView>
        <InView delay={80}>
          <p className="mt-4 max-w-reading text-body-lg text-secondary">
            Two of them became something you can open. Pick one.
          </p>
        </InView>
        <InView delay={160} className="mt-8">
          <SubjectTrace subjects={subjects} />
        </InView>

        {/* The plain record. With JavaScript off only the default
            subject would render above, so all three are stated here. */}
        <InView delay={240}>
          <dl className="mt-10 border-t border-hairline pt-6 text-body-sm">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex flex-wrap gap-x-3 gap-y-1 border-b border-hairline py-3"
              >
                <dt className="text-muted">{subject.name}</dt>
                <dd className="text-secondary">
                  {subject.outcomes.length > 0
                    ? subject.outcomes.map((o) => o.label).join(" · ")
                    : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </InView>
      </Container>

      {/* ---------- ALONGSIDE THE DEGREE ---------- */}
      <Container className="pt-16 sm:pt-24">
        <InView>
          <h2 className="font-mono text-label uppercase tracking-label text-data">
            Alongside the degree
          </h2>
        </InView>

        <div className="mt-6 flex flex-col gap-3">
          <InView delay={80}>
            <Reveal
              label="Courses taken outside the syllabus"
              meta={String(certifications.length) + " completed"}
              hint="Not required. Taken anyway."
            >
              <ul className="flex flex-col gap-3 text-secondary">
                {certifications.map((cert) => (
                  <li key={cert.title}>
                    <span className="text-primary">{cert.title}</span>
                    {isKnown(cert.provider) ? (
                      <span className="text-muted"> — {cert.provider}</span>
                    ) : null}
                    <span className="ms-2 font-mono text-label text-faint">
                      {cert.format}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </InView>

          <InView delay={140}>
            <Reveal
              label="The tools that came with it"
              meta="Systems"
              hint="The unglamorous half of the degree."
            >
              <div className="flex flex-wrap gap-2">
                {skillGroups
                  .filter((g) => g.id === "systems" || g.id === "languages")
                  .flatMap((g) => g.items)
                  .map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
              </div>
            </Reveal>
          </InView>
        </div>
      </Container>

      <Departure from="earth" />
    </>
  );
}
