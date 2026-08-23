import { Container } from "@/components/layout/Container";
import { Stamp } from "@/components/ui/Stamp";

/**
 * The ARRIVAL movement. Same structure in every destination, different
 * values -- this repetition is what makes eight regions feel like one
 * universe rather than eight websites.
 */
export function Arrival({
  index,
  name,
  scale,
  hook,
}: {
  index: string;
  name: string;
  scale: string;
  hook: string;
}) {
  return (
    <Container className="pt-16 sm:pt-24">
      <Stamp>
        {index} · {name} · {scale}
      </Stamp>
      <h1 className="mt-6 max-w-reading font-display text-display-lg leading-display tracking-display text-primary">
        {hook}
      </h1>
    </Container>
  );
}
