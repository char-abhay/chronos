import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { InView } from "@/components/motion/InView";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Reveal } from "@/components/interactive/Reveal";
import { Chip } from "@/components/ui/Chip";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getDestination } from "@/content/destinations";
import { profile, projectsOrdered } from "@/content";
import { spell, spellLower } from "@/lib/format/count";
import { endSentence, listOut } from "@/lib/format/prose";

const destination = getDestination("solar-system")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    `${spell(projectsOrdered.length)} systems built by ${profile.name} — ` +
    endSentence(listOut(projectsOrdered.map((project) => project.name))),
};

const onTheJob = projectsOrdered.filter(
  (project) => project.context === "internship"
).length;
const forTheDegree = projectsOrdered.length - onTheJob;

export default function SystemsPage() {
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
            {spell(onTheJob)} built on the job, {spellLower(forTheDegree)} for
            the degree. Open any of them.
          </p>
        </InView>

        <ol className="mt-10 flex flex-col gap-3">
          {projectsOrdered.map((project, i) => (
            <li key={project.slug}>
              <InView delay={Math.min(i * 60, 300)}>
              <Reveal
                label={project.name}
                meta={
                  (project.context === "internship" ? "Internship · " : "") +
                  project.dates.label
                }
                hint={project.subtitle ?? undefined}
              >
                <div className="text-secondary">
                  <p>{project.what}</p>
                  <p className="mt-3">{project.why}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>

                  <ul className="mt-5 flex list-disc flex-col gap-1.5 ps-5 text-body-sm marker:text-faint">
                    {project.functionality.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm">
                    <Link
                      href={"/projects/" + project.slug}
                      className="text-signal underline underline-offset-4 decoration-hairline hover:decoration-signal"
                    >
                      Full build →
                    </Link>
                    {project.links.map((link) => (
                      <ExternalLink key={link.href} href={link.href}>
                        {link.label}
                      </ExternalLink>
                    ))}
                  </div>
                </div>
              </Reveal>
              </InView>
            </li>
          ))}
        </ol>
      </Container>

      <Departure from="solar-system" />
    </>
  );
}
