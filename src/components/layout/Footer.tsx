import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { profile } from "@/content";

/**
 * Every fact a recruiter needs, in the footer of every page, in plain
 * server-rendered HTML. This is the last-resort guarantee: even if the
 * nav, the panels and all JavaScript fail, the contact routes are here.
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline py-12">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-body-lg text-primary">
              {profile.name}
            </p>
            <p className="mt-1 text-body-sm text-muted">
              {profile.credential} · {profile.location}
            </p>
          </div>

          <nav aria-label="Contact and profiles">
            <ul className="flex flex-col gap-2 text-body-sm sm:items-end">
              <li>
                <a
                  href={"mailto:" + profile.email}
                  className="text-secondary underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:text-primary hover:decoration-signal"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <ExternalLink href={profile.links.github.href}>
                  {profile.links.github.label}
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href={profile.links.linkedin.href}>
                  {profile.links.linkedin.label}
                </ExternalLink>
              </li>
              <li>
                <a
                  href={profile.links.resume.href}
                  className="text-secondary underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:text-primary hover:decoration-signal"
                >
                  {profile.links.resume.label}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
