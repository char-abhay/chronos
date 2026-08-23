import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Stamp } from "@/components/ui/Stamp";
import { projectsOrdered } from "@/content";
import type { Project } from "@/content/schema";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Five projects by Abhay P — blockchain, AI, IoT and web development, including work built during an internship at EduPhoenix Solutions.",
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
        Five builds, in reverse order.
      </h1>
      <p className="mt-4 max-w-reading text-secondary">
        One built during an internship, four academic. Where a public
        repository exists it is linked; where one does not, the code is
        shown instead.
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
