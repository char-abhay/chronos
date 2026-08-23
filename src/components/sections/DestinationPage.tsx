import { Container } from "@/components/layout/Container";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { ConceptList } from "@/components/science/ConceptList";
import { getDestination } from "@/content/destinations";
import { getScience } from "@/content/science";
import type { DestinationId } from "@/content/schema";

/**
 * One template, seven destinations.
 *
 * Keeping the four-movement rhythm in a single component is what makes
 * the regions feel like one universe -- and it means a change to the
 * rhythm is one edit, not seven.
 */
export function DestinationPage({ id }: { id: DestinationId }) {
  const destination = getDestination(id);
  const science = getScience(id);
  if (!destination) return null;

  return (
    <>
      <Arrival
        index={destination.index}
        name={destination.name}
        scale={destination.scale}
        hook={destination.hook}
      />

      {science ? (
        <Container className="pt-16 sm:pt-24">
          <ConceptList concepts={science.concepts} />
        </Container>
      ) : null}

      <Departure from={id} />
    </>
  );
}

/** Shared metadata builder, so every destination is titled consistently. */
export function destinationMetadata(id: DestinationId) {
  const destination = getDestination(id);
  if (!destination) return {};
  return {
    title: destination.name,
    description: destination.hook,
  };
}
