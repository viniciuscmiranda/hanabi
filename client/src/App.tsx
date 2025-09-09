import { useGame } from "./hooks/use-game";
import { useState } from "react";

import { Room } from "./components/room";
import { Loading } from "./components/loading";
import { Game } from "./components/game";
import { Setup } from "./components/setup";

// TODO: fix zoom
// TODO: reveal all cards at the end
// TODO: condition all piles are finished
export function App() {
  const [url, setUrl] = useState("");

  const {
    makePlayerReady,
    playCard,
    discardCard,
    giveTip,
    disconnect,
    connect,
    room,
    game,
    isConnected,
    isConnecting,
    error,
  } = useGame(url);

  if (error || !url) {
    return (
      <Setup
        error={error}
        initialValue={url}
        onConnect={(url) => {
          setUrl(url);
          connect();
        }}
      />
    );
  }

  if (isConnecting) {
    return <Loading message="Conectando-se ao servidor" />;
  }

  if (!isConnected) {
    return (
      <Setup
        error="Desconectado"
        initialValue={url}
        onConnect={(url) => {
          setUrl(url);
          connect();
        }}
      />
    );
  }

  if (!room) {
    return <Loading message="Carreganda sala" />;
  }

  if (!game) {
    return (
      <Room state={room} onReady={makePlayerReady} onDisconnect={disconnect} />
    );
  }

  return (
    <Game
      state={game}
      onPlayCard={playCard}
      onDiscardCard={discardCard}
      onGiveTip={giveTip}
      onReset={disconnect}
    />
  );
}
