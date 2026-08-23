import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Chip } from "@/components/ui/Chip";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Stamp } from "@/components/ui/Stamp";
import { getProject, isKnown, projects } from "@/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.what };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <Container width="reading" className="py-16 sm:py-24">
      <Stamp>
        {project.context === "internship"
          ? "Internship project · EduPhoenix Solutions"
          : "Academic project"}{" "}
        · {project.dates.label}
      </Stamp>

      <h1 className="mt-6 font-display text-display-lg leading-display tracking-display text-primary">
        {project.name}
      </h1>
      {project.subtitle ? (
        <p className="mt-2 text-body-lg text-data">{project.subtitle}</p>
      ) : null}

      {/* Stated before anything else where a name could imply more than
          the project does. */}
      {project.clarification ? (
        <p className="mt-6 border-s-2 border-[var(--status-warn)] ps-4 text-body-sm text-muted">
          {project.clarification}
        </p>
      ) : null}

      <p className="mt-8 text-body-lg text-secondary">{project.what}</p>
      <p className="mt-4 text-secondary">{project.why}</p>

      {/* Links render only where a real repository exists. */}
      {project.links.length > 0 ? (
        <p className="mt-8">
          {project.links.map((link) => (
            <ExternalLink key={link.href} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </p>
      ) : null}

      <section aria-labelledby="stack" className="mt-14">
        <h2
          id="stack"
          className="font-mono text-label uppercase tracking-label text-data"
        >
          Technologies
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
      </section>

      <section aria-labelledby="contribution" className="mt-14">
        <h2
          id="contribution"
          className="font-mono text-label uppercase tracking-label text-data"
        >
          Contribution
        </h2>
        <p className="mt-4 text-secondary">{project.contribution}</p>
      </section>

      <section aria-labelledby="functionality" className="mt-14">
        <h2
          id="functionality"
          className="font-mono text-label uppercase tracking-label text-data"
        >
          Key functionality
        </h2>
        <ul className="mt-4 flex list-disc flex-col gap-2 ps-5 text-secondary marker:text-faint">
          {project.functionality.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Outcome renders only if a factual one exists. Nothing is
          fabricated to fill the section. */}
      {isKnown(project.outcome) ? (
        <section aria-labelledby="outcome" className="mt-14">
          <h2
            id="outcome"
            className="font-mono text-label uppercase tracking-label text-data"
          >
            Outcome
          </h2>
          <p className="mt-4 text-secondary">{project.outcome}</p>
        </section>
      ) : null}

      {project.codeExcerpt ? (
        <section aria-labelledby="code" className="mt-14">
          <h2
            id="code"
            className="font-mono text-label uppercase tracking-label text-data"
          >
            Code — {project.codeExcerpt.source}
          </h2>
          <p className="mt-4 text-body-sm text-muted">
            {project.codeExcerpt.caption}
          </p>
          <div className="mt-4 overflow-x-auto rounded-[2px] border border-hairline bg-ground-inset">
            <pre className="p-4 text-body-sm">
              <code className="font-mono text-secondary">
                {project.codeExcerpt.code}
              </code>
            </pre>
          </div>
        </section>
      ) : null}

      {project.challenges ? (
        <section aria-labelledby="challenges" className="mt-14">
          <h2
            id="challenges"
            className="font-mono text-label uppercase tracking-label text-data"
          >
            Challenges
          </h2>
          <div className="mt-6 flex flex-col gap-8">
            {project.challenges.map((challenge) => (
              <article key={challenge.title}>
                <h3 className="font-display text-body-lg text-primary">
                  {challenge.title}
                </h3>
                <p className="mt-2 text-secondary">{challenge.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
