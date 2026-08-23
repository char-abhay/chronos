import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { destinations } from "@/content/destinations";
import type { DestinationId } from "@/content/schema";
import { Stamp } from "@/components/ui/Stamp";

/**
 * The DEPARTURE movement: where to go next.
 *
 * Every destination ends with an onward link, so no page is a dead end
 * and the site can be traversed without ever opening the map.
 */
export function Departure({ from }: { from: DestinationId }) {
  const index = destinations.findIndex((d) => d.id === from);
  const next = destinations[(index + 1) % destinations.length];

  return (
    <Container className="pt-16">
      <div className="border-t border-hairline pt-8">
        <Stamp>Next</Stamp>
        <Link
          href={next.href}
          className="mt-4 flex max-w-reading flex-col gap-1 rounded-[2px] transition-colors dur-micro hover:text-signal"
        >
          <span className="font-display text-display-sm leading-display tracking-display text-primary">
            {next.name}
          </span>
          <span className="text-secondary">{next.hook}</span>
        </Link>
      </div>
    </Container>
  );
}
