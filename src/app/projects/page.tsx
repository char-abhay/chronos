import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Stamp } from "@/components/ui/Stamp";
import { experience, profile, projectsOrdered } from "@/content";
import { spell, spellLower } from "@/lib/format/count";
import { endSentence } from "@/lib/format/prose";
import type { Project } from "@/content/schema";

export const metadata: Metadata = {
  title: "Projects",
  description:
    endSentence(
      `${spell(projectsOrdered.length)} projects by ${profile.name} — blockchain, ` +
        `AI, IoT and web development, including work built during an ` +
        `internship at ${experience[0].organisation}`
    ),
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card href={"/projects/" + project.slug}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Stamp>
          {project.context === "internship" ? "Internship" : "Academic"}
        </Stamp>
        <Stamp>{project.dates.label}</Stamp>
      </div>

      <h3 className="mt-4 font-display text-display-sm leading-display tracking-display text-primary">
        {project.name}
      </h3>
      {project.subtitle ? (
        <p className="mt-1 text-body-sm text-data">{project.subtitle}</p>
      ) : null}

      <p className="mt-3 text-secondary">{project.what}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </div>
    </Card>
  );
}

/* Counted across every project, not across the three display buckets
   below -- those exclude the featured ones, so reusing them would have
   made the sentence disagree with its own page. */
const internshipCount = projectsOrdered.filter(
  (p) => p.context === "internship"
).length;
const academicCount = projectsOrdered.filter(
  (p) => p.context === "academic"
).length;

export default function ProjectsPage() {
  const featured = projectsOrdered.filter((p) => p.featured);
  const internship = projectsOrdered.filter(
    (p) => !p.featured && p.context === "internship"
  );
  const academic = projectsOrdered.filter(
    (p) => !p.featured && p.context === "academic"
  );

  return (
    <Container className="py-16 sm:py-24">
      <Stamp>Projects</Stamp>
      <h1 className="mt-6 max-w-reading font-display text-display-lg leading-display tracking-display text-primary">
        {spell(projectsOrdered.length)} builds, in reverse order.
      </h1>
      <p className="mt-4 max-w-reading text-secondary">
        {spell(internshipCount)} built during an internship,{" "}
        {spellLower(academicCount)} academic. Where a public repository exists
        it is linked; where one does not, the code is shown instead.
      </p>

      {featured.length > 0 ? (
        <section aria-labelledby="featured" className="mt-16">
          <h2
            id="featured"
            className="font-mono text-label uppercase tracking-label text-data"
          >
            Selected work
          </h2>
          <div className="mt-6">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      {internship.length > 0 ? (
        <section aria-labelledby="internship" className="mt-16">
          <h2
            id="internship"
            className="font-mono text-label uppercase tracking-label text-data"
          >
            Internship
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {internship.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="academic" className="mt-16">
        <h2
          id="academic"
          className="font-mono text-label uppercase tracking-label text-data"
        >
          Academic
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {academic.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </Container>
  );
}
