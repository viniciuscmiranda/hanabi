import type { Card } from "./card";
import type { Event } from "./event";
import type { RoomSettings } from "./room-settings";

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

type PlayerRenameEvent = {
  event: Event.PLAYER_RENAME;
  payload?: never;
};

type PlayerSetWatchModeEvent = {
  event: Event.PLAYER_SET_WATCH_MODE;
  payload: {
    isWatchMode: boolean;
  };
};

type PlayerSetRoomSettingsEvent = {
  event: Event.PLAYER_SET_ROOM_SETTINGS;
  payload: RoomSettings;
};

type PlayerSetLeaderEvent = {
  event: Event.PLAYER_SET_LEADER;
  payload: {
    playerIndex: number;
  };
};

type PlayerKickPlayerEvent = {
  event: Event.PLAYER_KICK_PLAYER;
  payload: {
    playerIndex: number;
  };
};

export type PlayerEvent =
  | PlayerReadyEvent
  | PlayerPlayEvent
  | PlayerDiscardEvent
  | PlayerGiveTipEvent
  | PlayerRenameEvent
  | PlayerSetWatchModeEvent
  | PlayerSetRoomSettingsEvent
  | PlayerSetLeaderEvent
  | PlayerKickPlayerEvent;
