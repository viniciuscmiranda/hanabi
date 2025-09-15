import type { GameState } from "./game-state";
import type { RoomState } from "./room-state";
import type { Event } from "./event";

type RoomUpdateEvent = {
  event: Event.ROOM_UPDATE;
  payload: RoomState;
};

type GameUpdateEvent = {
  event: Event.GAME_UPDATE;
  payload: GameState;
};

type PlayerReactEvent = {
  event: Event.PLAYER_REACT;
  payload: {
    reaction: string;
  };
};

type ErrorEvent = {
  event: Event.ERROR;
  payload: { error: string };
};

export type GameEvent =
  | RoomUpdateEvent
  | GameUpdateEvent
  | ErrorEvent
  | PlayerReactEvent;
