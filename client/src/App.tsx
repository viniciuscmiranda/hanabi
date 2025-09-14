import { useEffect } from "react";

import { useGame } from "./hooks/use-game";

import { Room } from "./components/room";
import { Loading } from "./components/loading";
import { Game } from "./components/game";
import { Setup } from "./components/setup";

function setURL(url: string) {
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?server=${url}`
  );
}

export function App() {
  const url = new URLSearchParams(window.location.search).get("server") || "";

  const {
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
    room,
    game,
    isConnected,
    isConnecting,
    error,
  } = useGame(url);

  useEffect(() => {
    const roomId = room?.roomId;

    if (roomId && !url.includes(roomId)) {
      setURL(`${url}/${roomId}`);
    }
  }, [room?.roomId, url]);

  if (isConnecting) {
    return <Loading message="Conectando-se ao servidor" />;
  }

  if (!isConnected) {
    return (
      <Setup
        error={error}
        initialURL={url}
        onConnect={(url) => {
          connect(url);
          setURL(url);
        }}
      />
    );
  }

  if (!room) {
    return <Loading message="Carreganda sala" />;
  }

  if (!game) {
    return (
      <Room
        state={room}
        onReady={makePlayerReady}
        onRename={renamePlayer}
        onDisconnect={disconnect}
        onSetRoomSettings={setRoomSettings}
        onSetWatchMode={setWatchMode}
        onSetLeader={setLeader}
        onKickPlayer={kickPlayer}
      />
    );
  }

  return (
    <Game
      state={game}
      onPlayCard={playCard}
      onDiscardCard={discardCard}
      onGiveTip={giveTip}
      onReset={reset}
      onDisconnect={disconnect}
    />
  );
}
