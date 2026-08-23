import { Container } from "@/components/layout/Container";
import { Departure } from "@/components/sections/Departure";
import { ButtonLink } from "@/components/ui/Button";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Stamp } from "@/components/ui/Stamp";
import { education, experience, profile } from "@/content";

/**
 * Phase 3 homepage: structurally correct, visually plain.
 *
 * The cinematic treatment lands in Phase 4. What must already be true
 * here is the recruiter guarantee: name, credential and status are in
 * server-rendered HTML above the fold, before any scroll, any animation
 * or any JavaScript.
 */
export default function Home() {
  const role = experience[0];

  return (
    <>
      <Container className="pt-16 sm:pt-24">
        <Stamp>01 · Home · Here · now</Stamp>

        <h1 className="mt-6 max-w-reading font-display text-display-xl leading-display tracking-display text-primary">
          {profile.name}
        </h1>
        <p className="mt-6 max-w-reading text-body-lg text-secondary">
          {profile.credential}, specialising in Cloud Computing. Five things
          built, one of them on the job.
        </p>

        {/* Identity block. Above the fold, in the HTML, always. */}
        <div className="mt-12 border-t border-hairline pt-8">
          <p className="text-secondary">
            {education.qualification} · {education.institution},{" "}
            {education.location} ({education.dates.label})
          </p>
          <p className="mt-1 text-secondary">
            {role.role} — {role.organisation} ({role.dates.label})
          </p>
          <p className="mt-1 text-body-sm text-muted">{profile.location}</p>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-body-sm">
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

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/time" variant="primary">
              Begin
            </ButtonLink>
            <ButtonLink href="/profile" variant="secondary">
              View profile
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Projects
            </ButtonLink>
          </div>
        </div>
      </Container>

      <Departure from="home" />
    </>
  );
}
