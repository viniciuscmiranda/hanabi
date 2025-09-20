import type { GameState, Me, OtherPlayer } from "./game-state";
import type { RoomState } from "./room-state";
import type { Event } from "./event";
import type { Card } from "./card";

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

type PlayerPlayEvent = {
  event: Event.PLAYER_PLAY;
  payload: {
    success: boolean;
    playerIndex: number;
    cardIndex: number;
    card: Card;
    drawnCard?: Card;
    gameState: GameState;
  };
};

type PlayerDiscardEvent = {
  event: Event.PLAYER_DISCARD;
  payload: {
    playerIndex: number;
    cardIndex: number;
    card: Card;
    drawnCard?: Card;
    gameState: GameState;
  };
};

type PlayerGiveTipEvent = {
  event: Event.PLAYER_GIVE_TIP;
  payload: {
    playerIndex: number;
    selectedPlayerIndex: number;
    cardIndex: number;
    cards: ({ index: number } & (Me | OtherPlayer)["hand"][number])[];
    info: Card.INFO;
    gameState: GameState;
  };
};

type ErrorEvent = {
  event: Event.ERROR;
  payload: {
    error: string;
  };
};

export type PlayerActionGameEvent =
  | PlayerPlayEvent
  | PlayerDiscardEvent
  | PlayerGiveTipEvent;

export type GameEvent =
  | RoomUpdateEvent
  | GameUpdateEvent
  | ErrorEvent
  | PlayerReactEvent
  | PlayerPlayEvent
  | PlayerDiscardEvent
  | PlayerGiveTipEvent;
