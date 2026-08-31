import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { InView } from "@/components/motion/InView";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { SkillConstellation } from "@/components/interactive/SkillConstellation";
import { Chip } from "@/components/ui/Chip";
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
        <InView className="mt-4">
          <SkillConstellation clusters={clusters} projects={projects} />
        </InView>
      </Container>

      {/* The plain record. The constellation above is an enhancement;
          with JavaScript off only its default state would render, so
          every cluster is also listed here as text. Same pattern as the
          full record on /time. */}
      <Container className="pt-20 sm:pt-28">
        <InView>
          <h2 className="font-mono text-label uppercase tracking-label text-data">
            Every cluster
          </h2>
        </InView>
        <dl className="mt-6 flex flex-col gap-6">
          {skillGroups.map((group, i) => (
            <InView key={group.id} delay={Math.min(i * 50, 250)}>
              <div className="border-t border-hairline pt-4">
                <dt className="text-body-sm text-muted">
                  {group.label}
                  {group.note ? (
                    <span className="ms-2 font-mono text-label text-muted">
                      {group.note}
                    </span>
                  ) : null}
                </dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </dd>
              </div>
            </InView>
          ))}
        </dl>
      </Container>

      <Departure from="galaxy" />
    </>
  );
}
