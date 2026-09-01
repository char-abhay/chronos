import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { ExternalLink } from "@/components/ui/ExternalLink";
import {
  certifications,
  education,
  experience,
  isKnown,
  profile,
  projectsOrdered,
  skillGroups,
  softSkills,
} from "@/content";

/**
 * The complete professional snapshot.
 *
 * The recruiter's one-stop, rendered identically in the PROFILE overlay
 * and at /profile. Plain, scrollable, selectable, printable HTML: no 3D,
 * no scroll narrative, no animation. Everything a recruiter needs is
 * here, one click from any screen.
 *
 * Deliberately a server component with zero client JavaScript.
 *
 * `headingLevel` exists because this renders in two places at different
 * depths: as the page content at /profile and /resume, where the name
 * must be the h1, and inside the PROFILE overlay, where the Panel
 * already owns the h2. Hardcoding a level left /profile with no h1 at
 * all, which breaks heading navigation on the page a recruiter is most
 * likely to land on.
 */

type Level = 1 | 2 | 3;

function Heading({
  level,
  className,
  children,
}: {
  level: Level;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = ("h" + level) as "h1" | "h2" | "h3";
  return <Tag className={className}>{children}</Tag>;
}

function Group({
  title,
  level,
  children,
}: {
  title: string;
  level: Level;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-hairline pt-6">
      <Heading
        level={level}
        className="font-mono text-label uppercase tracking-label text-data"
      >
        {title}
      </Heading>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ProfileContent({
  headingLevel = 2,
}: {
  headingLevel?: 1 | 2;
}) {
  const nameLevel: Level = headingLevel;
  const groupLevel: Level = (headingLevel + 1) as Level;
  return (
    <div className="flex flex-col gap-8">
      {/* Identity first, always. */}
      <header>
        <Heading
          level={nameLevel}
          className="font-display text-display-sm leading-display tracking-display text-primary"
        >
          {profile.name}
        </Heading>
        <p className="mt-2 text-secondary">
          {profile.credential} — {education.specialisation}
        </p>
        <p className="mt-1 text-body-sm text-muted">{profile.location}</p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-body-sm">
          <a
            href={"mailto:" + profile.email}
            className="text-signal underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:decoration-signal"
          >
            {profile.email}
          </a>
          <ExternalLink href={profile.links.github.href}>
            {profile.links.github.label}
          </ExternalLink>
          <ExternalLink href={profile.links.linkedin.href}>
            {profile.links.linkedin.label}
          </ExternalLink>
          <a
            href={profile.links.resume.href}
            className="text-secondary underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:text-primary hover:decoration-signal"
          >
            Resume (PDF)
          </a>
        </div>
      </header>

      <Group title="Objective" level={groupLevel}>
        <p className="max-w-reading text-secondary">{profile.objective}</p>
      </Group>

      <Group title="Education" level={groupLevel}>
        <p className="font-display text-body-lg text-primary">
          {education.qualification}
        </p>
        <p className="mt-1 text-secondary">
          {education.institution} · {education.location}
        </p>
        <p className="mt-1 font-mono text-label text-data tabular">
          {education.dates.label}
        </p>
        <p className="mt-3 text-body-sm text-muted">
          Major subjects: {education.majorSubjects.join(", ")}
        </p>
      </Group>

      <Group title="Experience" level={groupLevel}>
        {experience.map((role) => (
          <article key={role.organisation}>
            <p className="font-display text-body-lg text-primary">
              {role.role}
            </p>
            <p className="mt-1 text-secondary">
              {role.organisation} · {role.location}
            </p>
            <p className="mt-1 font-mono text-label text-data tabular">
              {role.dates.label}
            </p>
            <ul className="mt-4 flex list-disc flex-col gap-2 ps-5 text-body-sm text-secondary marker:text-faint">
              {role.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {role.deliverables.length > 0 ? (
              <p className="mt-4 text-body-sm text-muted">
                Built during this role:{" "}
                {role.deliverables.map((slug, i) => {
                  const project = projectsOrdered.find((p) => p.slug === slug);
                  if (!project) return null;
                  return (
                    <span key={slug}>
                      {i > 0 ? ", " : ""}
                      <Link
                        href={"/projects/" + project.slug}
                        className="text-secondary underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:text-primary hover:decoration-signal"
                      >
                        {project.name}
                      </Link>
                    </span>
                  );
                })}
              </p>
            ) : null}
          </article>
        ))}
      </Group>

      <Group title="Technical skills" level={groupLevel}>
        <dl className="flex flex-col gap-4">
          {skillGroups.map((group) => (
            <div key={group.id}>
              <dt className="text-body-sm text-muted">
                {group.label}
                {group.note ? (
                  <span className="ms-2 font-mono text-label text-muted">
                    {group.note}
                  </span>
                ) : null}
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Group>

      <Group title="Projects" level={groupLevel}>
        <ul className="flex flex-col gap-4">
          {projectsOrdered.map((project) => (
            <li key={project.slug}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <Link
                  href={"/projects/" + project.slug}
                  className="font-display text-body-lg text-primary underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:decoration-signal"
                >
                  {project.name}
                </Link>
                <span className="font-mono text-label text-muted tabular">
                  {project.dates.label}
                </span>
                {project.context === "internship" ? (
                  <span className="font-mono text-label uppercase tracking-label text-data">
                    Internship
                  </span>
                ) : null}
              </div>
              <p className="mt-1 max-w-reading text-body-sm text-secondary">
                {project.what}
              </p>
              {/* Rendered only where a real repository exists. No ghost
                  button, no disabled state, no "private" badge. */}
              {project.links.length > 0 ? (
                <p className="mt-2 text-body-sm">
                  {project.links.map((link) => (
                    <ExternalLink key={link.href} href={link.href}>
                      {link.label}
                    </ExternalLink>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Certifications" level={groupLevel}>
        <ul className="flex flex-col gap-2 text-body-sm">
          {certifications.map((cert) => (
            <li key={cert.title} className="text-secondary">
              {cert.title}
              {isKnown(cert.provider) ? (
                <span className="text-muted"> — {cert.provider}</span>
              ) : null}
              <span className="ms-2 font-mono text-label text-muted">
                {cert.format}
              </span>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Working style" level={groupLevel}>
        <p className="text-body-sm text-muted">{softSkills.join(" · ")}</p>
      </Group>
    </div>
  );
}
