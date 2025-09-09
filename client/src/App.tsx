import { useGame } from "./hooks/use-game";

import { Room } from "./components/room";
import { Loading } from "./components/loading";
import { Game } from "./components/game";

export function App() {
  const {
    makePlayerReady,
    playCard,
    discardCard,
    giveTip,
    room,
    game,
    isConnected,
  } = useGame("ws://localhost:8080");

  if (!isConnected) {
    return <Loading message="Conectando-se ao servidor" />;
  }

  if (!room) {
    return <Loading message="Carreganda sala" />;
  }

  if (!game) {
    return <Room state={room} onReady={makePlayerReady} />;
  }

  if (game.isGameFinished) {
    return <div>game finished</div>;
  }

  return (
    <Game
      state={game}
      onPlayCard={playCard}
      onDiscardCard={discardCard}
      onGiveTip={giveTip}
    />
  );
}
