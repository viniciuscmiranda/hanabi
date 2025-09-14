import type { Card } from "./card";
import type { Expansion } from "./expansion";
import type { Log } from "./log";

export type OtherPlayer = {
  name: string;
  isMe: false;
  isLeader: boolean;
  hand: Card[];
};

export type Me = {
  name: string;
  isMe: true;
  isLeader: boolean;
  hand: (Omit<Card, "value" | "color"> & {
    value: Card.VALUE | null;
    color: Card.COLOR | null;
  })[];
};

export type GameState = {
  roomId: string;
  tips: number;
  lives: number;
  score: number;
  turnNumber: number;
  roundNumber: number;
  currentPlayerIndex: number;
  isGameFinished: boolean;
  isGamePaused: boolean;
  isWatchMode: boolean;
  expansions: Expansion[];
  logs: Log[];
  discardPile: Card[];
  deckSize: number;
  board: Card[][];
  players: (OtherPlayer | Me)[];
};
