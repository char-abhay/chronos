import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ProfileContent } from "@/components/portfolio/ProfileContent";
import { Stamp } from "@/components/ui/Stamp";
import { profile } from "@/content";

/**
 * The same content module as the PROFILE overlay, at a real URL so it
 * can be linked, bookmarked, indexed and printed. The overlay is the
 * convenience; this is the canonical copy.
 */
export const metadata: Metadata = {
  title: "Profile",
  description:
    "Abhay P — BCA graduate specialising in Cloud Computing. Education, internship, technical skills, projects and contact details.",
};

export default function ProfilePage() {
  return (
    <Container width="reading" className="py-16 sm:py-24">
      <Stamp>Professional snapshot</Stamp>
      <div className="mt-8">
        <ProfileContent headingLevel={1} />
      </div>
      <p className="mt-12 border-t border-hairline pt-6 text-body-sm text-muted">
        Prefer a document? <a href={profile.links.resume.href} className="text-secondary underline underline-offset-4 decoration-hairline hover:text-primary hover:decoration-signal">Download the resume as a PDF</a>.
      </p>
    </Container>
  );
}
