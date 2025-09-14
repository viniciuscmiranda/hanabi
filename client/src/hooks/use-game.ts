import { useRef, useEffect, useCallback, useState } from "react";

import type {
  RoomState,
  GameState,
  GameEvent,
  PlayerEvent,
  Card,
  RoomSettings,
} from "../../../core/types";

const TIMEOUT = 2000;
const DELAY = 300;

export function useGame(url?: string) {
  const ws = useRef<WebSocket>(null);
  const connectionDelay = useRef<NodeJS.Timeout>(null);
  const [room, setRoom] = useState<RoomState>();
  const [game, setGame] = useState<GameState>();

  const [error, setError] = useState<string>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const disconnect = useCallback(() => {
    if (ws.current) ws.current.close();
    if (connectionDelay.current) clearTimeout(connectionDelay.current);
    ws.current = null;
    setIsConnected(false);
    setIsConnecting(false);
    setGame(undefined);
    setRoom(undefined);
  }, []);

  const connect = useCallback(
    (url: string) => {
      if (connectionDelay.current) clearTimeout(connectionDelay.current);
      if (ws.current?.readyState === WebSocket.OPEN) return;

      setError(undefined);
      setIsConnecting(true);

      connectionDelay.current = setTimeout(() => {
        try {
          ws.current = new WebSocket(url);
        } catch {
          setError("Não foi possível conectar-se ao servidor");
          disconnect();
          return;
        }

        const connectionTimeout = setTimeout(() => {
          if (ws.current?.readyState !== WebSocket.OPEN) {
            setError("Não foi possível conectar-se ao servidor");
            disconnect();
          }
        }, TIMEOUT);

        ws.current.onerror = () => {
          clearTimeout(connectionTimeout);
          setError("Não foi possível conectar-se ao servidor");
          disconnect();
        };

        ws.current.onopen = () => {
          clearTimeout(connectionTimeout);
          setIsConnecting(false);
          setIsConnected(true);
        };

        ws.current.onclose = () => {
          disconnect();
        };

        ws.current.onmessage = (message) => {
          const data = JSON.parse(message.data) as GameEvent;
          const { event, payload } = data;

          switch (event) {
            case "ROOM_UPDATE":
              setRoom(payload);
              break;
            case "GAME_UPDATE":
              setGame(payload);
              break;
            case "ERROR":
              setError(payload.error);
              break;
          }
        };
      }, DELAY);
    },
    [disconnect]
  );

  // initialize connection on first render
  useEffect(() => {
    if (url) connect(url);
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    setGame(undefined);
  }, []);

  const send = useCallback((event: PlayerEvent) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify(event));
  }, []);

  const makePlayerReady = useCallback(() => {
    send({ event: "PLAYER_READY" });
  }, [send]);

  const playCard = useCallback(
    (cardIndex: number) => {
      send({ event: "PLAYER_PLAY", payload: { cardIndex } });
    },
    [send]
  );

  const discardCard = useCallback(
    (cardIndex: number) => {
      send({ event: "PLAYER_DISCARD", payload: { cardIndex } });
    },
    [send]
  );

  const giveTip = useCallback(
    (playerIndex: number, cardIndex: number, info: Card.INFO) => {
      send({
        event: "PLAYER_GIVE_TIP",
        payload: { playerIndex, cardIndex, info },
      });
    },
    [send]
  );

  const renamePlayer = useCallback(() => {
    send({ event: "PLAYER_RENAME" });
  }, [send]);

  const setRoomSettings = useCallback(
    (settings: RoomSettings) => {
      send({ event: "PLAYER_SET_ROOM_SETTINGS", payload: settings });
    },
    [send]
  );

  const setWatchMode = useCallback(
    (isWatchMode: boolean) => {
      send({ event: "PLAYER_SET_WATCH_MODE", payload: { isWatchMode } });
    },
    [send]
  );

  const setLeader = useCallback(
    (playerIndex: number) => {
      send({ event: "PLAYER_SET_LEADER", payload: { playerIndex } });
    },
    [send]
  );

  const kickPlayer = useCallback(
    (playerIndex: number) => {
      send({ event: "PLAYER_KICK_PLAYER", payload: { playerIndex } });
    },
    [send]
  );

  return {
    room,
    game,
    error,
    isConnected,
    isConnecting,
    makePlayerReady,
    renamePlayer,
    setRoomSettings,
    setWatchMode,
    setLeader,
    kickPlayer,
    playCard,
    discardCard,
    giveTip,
    disconnect,
    connect,
    reset,
  };
}
