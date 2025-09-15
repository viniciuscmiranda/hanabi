import type { Expansion } from "./expansion";

export type Room = {
  id: string;
  players: number;
  isGameStarted: boolean;
  allowWatchMode: boolean;
  expansions: Expansion[];
};
