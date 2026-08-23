import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Reveal } from "@/components/interactive/Reveal";
import { Chip } from "@/components/ui/Chip";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getDestination } from "@/content/destinations";
import { projectsOrdered } from "@/content";

const destination = getDestination("solar-system")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    "Five systems built by Abhay P — blockchain voting, IoT object detection, an AI chatbot, a digital voting machine and an e-commerce platform.",
};

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
        <p className="max-w-reading text-body-lg text-secondary">
          One built on the job, four for the degree. Open any of them.
        </p>

        <ol className="mt-10 flex flex-col gap-3">
          {projectsOrdered.map((project) => (
            <li key={project.slug}>
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
                    <a
                      href={"/projects/" + project.slug}
                      className="text-signal underline underline-offset-4 decoration-hairline hover:decoration-signal"
                    >
                      Full build →
                    </a>
                    {project.links.map((link) => (
                      <ExternalLink key={link.href} href={link.href}>
                        {link.label}
                      </ExternalLink>
                    ))}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>

      <Departure from="solar-system" />
    </>
  );
}
