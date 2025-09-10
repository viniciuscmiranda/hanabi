import type { Card } from "./card";
import type { Expansion } from "./expansion";
import type { Log } from "./log";

export type OtherPlayer = {
  name: string;
  isMe: false;
  hand: Card[];
};

export type Me = {
  name: string;
  isMe: true;
  hand: (Omit<Card, "value" | "color"> & {
    value: Card.VALUE | null;
    color: Card.COLOR | null;
  })[];
};

export type GameState = {
  tips: number;
  lives: number;
  score: number;
  turnNumber: number;
  roundNumber: number;
  currentPlayerIndex: number;
  isGameFinished: boolean;
  isGamePaused: boolean;
  expansions: Expansion[];
  logs: Log[];
  discardPile: Card[];
  deckSize: number;
  board: Card[][];
  players: (OtherPlayer | Me)[];
};
