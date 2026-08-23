import type { Metadata } from "next";
import {
  DestinationPage,
  destinationMetadata,
} from "@/components/sections/DestinationPage";

export const metadata: Metadata = destinationMetadata("solar-system");

export default function Page() {
  return <DestinationPage id="solar-system" />;
}
