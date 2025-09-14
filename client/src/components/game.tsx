import { useMemo } from "react";
import type { GameState } from "../../../core/types";
import { Card } from "./card";
import { Hand } from "./hand";
import { Board } from "./board";
import { Pause } from "./pause";
import { GameOver } from "./game-over";
import { DisconnectButton } from "./disconnect-button";
import { Logs } from "./logs";

type GameProps = {
  state: GameState;
  onReset: () => void;
  onDisconnect: () => void;
  onPlayCard: (cardIndex: number) => void;
  onDiscardCard: (cardIndex: number) => void;
  onGiveTip: (
    playerIndex: number,
    cardIndex: number,
    info: "value" | "color"
  ) => void;
};

export const Game = ({
  state,
  onReset,
  onDisconnect,
  onPlayCard,
  onDiscardCard,
  onGiveTip,
}: GameProps) => {
  const players = useMemo(() => {
    const players = state.players.map((p, index) => ({ ...p, index }));

    while (players.findIndex((player) => player.isMe) > 0) {
      players.push(players.shift()!);
    }

    return players;
  }, [state.players]);

  const isMyTurn =
    players.find((player) => player.isMe)?.index === state.currentPlayerIndex;

  return (
    <main className="game">
      <Logs logs={state.logs} />
      <DisconnectButton onDisconnect={onDisconnect} />

      {state.isGamePaused && !state.isGameFinished && <Pause />}
      {state.isWatchMode && <span className="watch-mode">Modo espectador</span>}
      {state.isGameFinished && <GameOver onReset={onReset} state={state} />}

      <section className="players">
        <ul>
          {players.map((player, index) => {
            return (
              <Hand
                key={player.index}
                isMe={state.isWatchMode ? index === 0 : player.isMe}
                isCurrent={state.currentPlayerIndex === player.index}
                name={`${player.name} (${player.index + 1})`}
              >
                {player.hand.map((card, index) => {
                  const myHandOptions = [
                    {
                      label: "Jogar",
                      onClick: () => onPlayCard(index),
                    },
                    {
                      label: "Descartar",
                      onClick: () => onDiscardCard(index),
                    },
                  ];

                  const otherHandOptions = [
                    {
                      label: "Cor",
                      onClick: () => onGiveTip(player.index, index, "color"),
                      disabled:
                        card.isColorRevealed || card.color === "colorless",
                    },
                    {
                      label: "Número",
                      onClick: () => onGiveTip(player.index, index, "value"),
                      disabled: card.isValueRevealed,
                    },
                  ];

                  return (
                    <Card
                      key={index}
                      card={card}
                      anchorTop={player.isMe}
                      options={player.isMe ? myHandOptions : otherHandOptions}
                      showTips={!player.isMe && !state.isGameFinished}
                      isValueRevealed={card.isValueRevealed}
                      isColorRevealed={card.isColorRevealed}
                      disabled={
                        !state.isGameFinished &&
                        (!isMyTurn || (!player.isMe && state.tips <= 0))
                      }
                    />
                  );
                })}
              </Hand>
            );
          })}
        </ul>
      </section>

      <Board state={state} />
    </main>
  );
};
