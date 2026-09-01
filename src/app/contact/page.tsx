import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Stamp } from "@/components/ui/Stamp";
import { profile } from "@/content";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    `Get in touch with ${profile.name} — email, GitHub, LinkedIn and resume.`,
};

export default function ContactPage() {
  return (
    <Container width="reading" className="py-16 sm:py-24">
      <Stamp>Next destination</Stamp>
      <h1 className="mt-6 font-display text-display-lg leading-display tracking-display text-primary">
        Every future becomes someone&rsquo;s past.
      </h1>
      <p className="mt-4 text-body-lg text-secondary">
        Looking for an entry-level Software Developer or IT role. The
        fastest way to reach me is email.
      </p>

      {/* The address is a real, selectable, copyable link -- no
          obfuscation tricks. Those break copy-paste and screen readers
          for a marginal gain against scrapers. */}
      <div className="mt-10 border-t border-hairline pt-8">
        <a
          href={"mailto:" + profile.email}
          className="font-display text-display-sm leading-display tracking-display text-signal underline underline-offset-[6px] decoration-hairline transition-colors dur-micro hover:decoration-signal"
        >
          {profile.email}
        </a>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body-sm">
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
              Resume (PDF)
            </a>
          </li>
        </ul>
      </div>

      <section aria-labelledby="form-heading" className="mt-14">
        <h2
          id="form-heading"
          className="font-mono text-label uppercase tracking-label text-data"
        >
          Or compose a message
        </h2>
        <div className="mt-6">
          <ContactForm email={profile.email} />
        </div>
      </section>
    </Container>
  );
}
