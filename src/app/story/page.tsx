import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";
import { getDestination } from "@/content/destinations";
import { isKnown, projectsOrdered, storySegments } from "@/content";
import { education, profile } from "@/content";
import { spellLower } from "@/lib/format/count";

const destination = getDestination("story")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    `${profile.name} — BCA graduate in ${education.specialisation}. Education, ` +
    `internship and ${spellLower(projectsOrdered.length)} projects, as a timeline.`,
};

export default function StoryPage() {
  return (
    <>
      <Arrival
        index={destination.index}
        name={destination.name}
        scale={destination.scale}
        hook={destination.hook}
      />

      <Container className="pt-16 sm:pt-24">
        <Timeline>
          {storySegments.map((segment) => {
            // The challenges segment is deliberately unwritten. It renders
            // nothing rather than a placeholder -- an empty state that says
            // "coming soon" would be worse than the honest absence.
            if (!isKnown(segment.body)) return null;

            return (
              <TimelineItem
                key={segment.id}
                marker={isKnown(segment.marker) ? segment.marker : undefined}
                title={segment.label}
                level={2}
              >
                <p>{segment.body}</p>

                {segment.projects ? (
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-body-sm">
                    {segment.projects.map((slug) => {
                      const project = projectsOrdered.find(
                        (p) => p.slug === slug
                      );
                      if (!project) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={"/projects/" + slug}
                            className="text-secondary underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:text-primary hover:decoration-signal"
                          >
                            {project.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </TimelineItem>
            );
          })}
        </Timeline>
      </Container>

      <Departure from="story" />
    </>
  );
}
