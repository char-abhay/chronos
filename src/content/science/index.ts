import type { DestinationId, ScienceModule } from "../schema";
import { homeScience } from "./home";
import { timeScience } from "./time";
import { earthScience } from "./earth";
import { solarSystemScience } from "./solar-system";
import { galaxyScience } from "./galaxy";
import { blackHoleScience } from "./black-holes";
import { futureScience } from "./future";

/**
 * Seven science modules. MY STORY has none by design -- it is a personal
 * timeline, not a science destination.
 */
export const scienceModules: ScienceModule[] = [
  homeScience,
  timeScience,
  earthScience,
  solarSystemScience,
  galaxyScience,
  blackHoleScience,
  futureScience,
];

export function getScience(id: DestinationId): ScienceModule | undefined {
  return scienceModules.find((m) => m.destination === id);
}

export {
  homeScience,
  timeScience,
  earthScience,
  solarSystemScience,
  galaxyScience,
  blackHoleScience,
  futureScience,
};
