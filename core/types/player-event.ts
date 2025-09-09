import type { Card } from "./card";
import type { Event } from "./event";

type PlayerReadyEvent = {
  event: Event.PLAYER_READY;
  payload?: never;
};

type PlayerPlayEvent = {
  event: Event.PLAYER_PLAY;
  payload: {
    cardIndex: number;
  };
};

type PlayerDiscardEvent = {
  event: Event.PLAYER_DISCARD;
  payload: {
    cardIndex: number;
  };
};

type PlayerGiveTipEvent = {
  event: Event.PLAYER_GIVE_TIP;
  payload: {
    playerIndex: number;
    cardIndex: number;
    info: Card.INFO;
  };
};

export type PlayerEvent =
  | PlayerReadyEvent
  | PlayerPlayEvent
  | PlayerDiscardEvent
  | PlayerGiveTipEvent;
