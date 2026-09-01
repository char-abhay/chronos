import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ProfileContent } from "@/components/portfolio/ProfileContent";
import { ButtonLink } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { education, profile } from "@/content";

/**
 * Print-optimised resume.
 *
 * The PDF is the artefact recruiters file; this page is the version
 * that is linkable, searchable and readable on a phone without pinching.
 * Both exist because they are used differently.
 */
export const metadata: Metadata = {
  title: "Resume",
  description:
    `Resume of ${profile.name} — BCA graduate, ${education.specialisation}. ` +
    "Available as a web page and as a PDF download.",
};

export default function ResumePage() {
  return (
    <Container width="reading" className="py-16 sm:py-24">
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <Stamp>Resume</Stamp>
        <ButtonLink href={profile.links.resume.href} variant="primary">
          Download PDF
        </ButtonLink>
      </div>

      <div className="mt-8">
        <ProfileContent headingLevel={1} />
      </div>
    </Container>
  );
}
