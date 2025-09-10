import type { Expansion } from "./expansion";

export type RoomState = {
  expansions: Expansion[];
  players: {
    name: string;
    isMe: boolean;
    ready: boolean;
  }[];
};
