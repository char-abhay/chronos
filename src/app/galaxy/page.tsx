import type { Metadata } from "next";
import {
  DestinationPage,
  destinationMetadata,
} from "@/components/sections/DestinationPage";

export const metadata: Metadata = destinationMetadata("galaxy");

export default function Page() {
  return <DestinationPage id="galaxy" />;
}
