import { useGame } from "./hooks/use-game";

import { Room } from "./components/room";
import { Loading } from "./components/loading";
import { Game } from "./components/game";
import { Setup } from "./components/setup";

export function App() {
  const {
    makePlayerReady,
    renamePlayer,
    setExpansions,
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
  } = useGame();

  if (isConnecting) {
    return <Loading message="Conectando-se ao servidor" />;
  }

  if (!isConnected) {
    const url = sessionStorage.getItem("url") || "ws://localhost:8080";
    const setUrl = (url: string) => sessionStorage.setItem("url", url);

    return (
      <Setup
        error={error}
        initial={url}
        onConnect={(url) => {
          setUrl(url);
          connect(url);
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
        onSetExpansions={setExpansions}
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
