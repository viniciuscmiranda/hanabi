import { useGame } from "./hooks/use-game";

import { Room } from "./components/room";
import { Loading } from "./components/loading";
import { Game } from "./components/game";
import { Setup } from "./components/setup";

export function App() {
  const url = new URLSearchParams(window.location.search).get("server") || "";

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
  } = useGame(url);

  if (isConnecting) {
    return <Loading message="Conectando-se ao servidor" />;
  }

  if (!isConnected) {
    return (
      <Setup
        error={error}
        initial={url}
        onConnect={(url) => {
          connect(url);
          window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?server=${url}`
          );
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
