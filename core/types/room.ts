import type { Expansion } from "./expansion";

export type Room = {
  id: string;
  players: number;
  allowWatchMode: boolean;
  expansions: Expansion[];
  game: {
    score: number;
    deckSize: number;
    lives: number;
    turnNumber: number;
    roundNumber: number;
    tips: number;
    isGamePaused: boolean;
  } | null;
};
