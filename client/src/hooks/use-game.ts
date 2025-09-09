import { useRef, useEffect, useCallback, useState } from "react";
import type {
  RoomState,
  GameState,
  GameEvent,
  PlayerEvent,
} from "../../../core/types";

export function useGame(url: string) {
  const ws = useRef<WebSocket>(null);
  const [room, setRoom] = useState<RoomState>();
  const [game, setGame] = useState<GameState>();

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (ws.current?.readyState !== WebSocket.OPEN) {
      ws.current = new WebSocket(url);

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
        }
      };

      setIsConnected(true);
    }

    return () => {
      if (ws.current) ws.current.close();
      setIsConnected(false);
    };
  }, [url]);

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

  return {
    room,
    game,
    isConnected,
    makePlayerReady,
    playCard,
    discardCard,
    giveTip,
  };
}
