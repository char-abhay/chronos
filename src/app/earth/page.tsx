import type { Metadata } from "next";
import {
  DestinationPage,
  destinationMetadata,
} from "@/components/sections/DestinationPage";

export const metadata: Metadata = destinationMetadata("earth");

export default function Page() {
  return <DestinationPage id="earth" />;
}
