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

type GameStopEvent = {
  event: Event.GAME_STOP;
  payload?: never;
};

export type GameEvent = RoomUpdateEvent | GameUpdateEvent | GameStopEvent;
