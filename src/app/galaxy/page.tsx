import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { SkillConstellation } from "@/components/interactive/SkillConstellation";
import { getDestination } from "@/content/destinations";
import { projectsOrdered, skillGroups } from "@/content";

const destination = getDestination("galaxy")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    "The technical skills of Abhay P, and which builds each one actually turned up in.",
};

export default function ConstellationPage() {
  // Minimal shapes only: the full content modules stay on the server.
  const projects = projectsOrdered.map((p) => ({
    slug: p.slug,
    name: p.name,
    dates: p.dates.label,
  }));

  const clusters = skillGroups.map((g) => ({
    id: g.id,
    label: g.label,
    items: g.items,
    note: g.note,
    relatedProjects: g.relatedProjects,
  }));

  return (
    <>
      <Arrival
        index={destination.index}
        name={destination.name}
        scale={destination.scale}
        hook={destination.hook}
      />

      <Container className="pt-12 sm:pt-16">
        <div className="mt-4">
          <SkillConstellation clusters={clusters} projects={projects} />
        </div>
      </Container>

      <Departure from="galaxy" />
    </>
  );
}
