import type { RoomSettings } from "./room-settings";

export type RoomState = {
  roomId: string;
  settings: RoomSettings;
  players: {
    name: string;
    isMe: boolean;
    ready: boolean;
    isWatching: boolean;
    isLeader: boolean;
  }[];
};
