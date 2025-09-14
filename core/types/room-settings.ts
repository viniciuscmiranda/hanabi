import type { Expansion } from "./expansion";

export type RoomSettings = {
  isPublic: boolean;
  allowWatchMode: boolean;
  expansions: Expansion[];
};
