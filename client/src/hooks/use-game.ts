import { useRef, useEffect, useCallback, useState } from "react";
import type {
  RoomState,
  GameState,
  GameEvent,
  PlayerEvent,
} from "../../../core/types";

const TIMEOUT = 2000;
const DELAY = 300;

export function useGame(url: string) {
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
    setError(undefined);
  }, []);

  const connect = useCallback(async () => {
    setError(undefined);

    if (connectionDelay.current) clearTimeout(connectionDelay.current);
    if (!url) return;

    setIsConnecting(true);

    await new Promise((resolve) => {
      connectionDelay.current = setTimeout(resolve, DELAY);
    });

    try {
      ws.current = new WebSocket(url);
    } catch {
      disconnect();
      setError("Não foi possível conectar-se ao servidor");
      return;
    }

    const connectionTimeout = setTimeout(() => {
      if (ws.current?.readyState !== WebSocket.OPEN) {
        disconnect();
        setError("Não foi possível conectar-se ao servidor");
      }
    }, TIMEOUT);

    ws.current.onerror = () => {
      clearTimeout(connectionTimeout);
      disconnect();
      setError("Não foi possível conectar-se ao servidor");
    };

    ws.current.onopen = () => {
      clearTimeout(connectionTimeout);
      setIsConnecting(false);
      setIsConnected(true);
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
        case "GAME_STOP":
          setGame(undefined);
          break;
        case "ERROR":
          setError(payload.error);
          break;
      }
    };
  }, [url, disconnect]);

  useEffect(() => {
    if (ws.current?.readyState !== WebSocket.OPEN) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

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
    (playerIndex: number, cardIndex: number, info: "value" | "color") => {
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

  return {
    room,
    game,
    error,
    isConnected,
    isConnecting,
    makePlayerReady,
    playCard,
    discardCard,
    giveTip,
    disconnect,
    connect,
    renamePlayer,
  };
}
