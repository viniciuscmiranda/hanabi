import { useMemo } from "react";

import { Card } from "./card";
import { Hand } from "./hand";
import { Logs } from "./logs";
import { Board } from "./board";
import { Pause } from "./pause";
import { GameOver } from "./game-over";

import type { GameState, PlayerActionGameEvent } from "../../../core/types";

type GameProps = {
  state: GameState;
  onReset: () => void;
  event?: PlayerActionGameEvent;
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
  event,
  onReset,
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

  function getAnimationProps(
    playerIndex: number,
    cardIndex: number
  ): Partial<React.ComponentProps<typeof Card>> {
    if (!event) return {};
    if (playerIndex !== event.payload.playerIndex) return {};
    if (cardIndex !== event.payload.cardIndex) return {};

    switch (event.event) {
      case "PLAYER_PLAY":
        return {
          animation: event.payload.success ? "play" : "discard",
          backCard: event.payload.card,
          drawnCard: event.payload.drawnCard,
        };
      case "PLAYER_DISCARD":
        return {
          animation: "discard",
          backCard: event.payload.card,
          drawnCard: event.payload.drawnCard,
        };
      case "PLAYER_GIVE_TIP":
        // TODO: get other cards that have being revealed
        return {
          animation: "give-tip",
        };
    }
  }

  return (
    <main className="game">
      <Logs logs={state.logs} />

      {state.isGamePaused && !state.isGameFinished && <Pause />}
      {state.isGameFinished && <GameOver onReset={onReset} state={state} />}

      <section className="players">
        <ul>
          {players.map((player, playerIndex) => {
            return (
              <Hand
                key={player.index}
                isMe={state.isWatchMode ? playerIndex === 0 : player.isMe}
                isCurrent={state.currentPlayerIndex === player.index}
                isWatchMode={playerIndex === 0 && state.isWatchMode}
                name={`${player.name} (${player.index + 1})`}
              >
                {player.hand.map((card, cardIndex) => {
                  const myHandOptions = [
                    {
                      label: "Jogar",
                      onClick: () => onPlayCard(cardIndex),
                    },
                    {
                      label: "Descartar",
                      onClick: () => onDiscardCard(cardIndex),
                    },
                  ];

                  const otherHandOptions = [
                    {
                      label: "Cor",
                      onClick: () =>
                        onGiveTip(player.index, cardIndex, "color"),
                      disabled:
                        card.isColorRevealed || card.color === "colorless",
                    },
                    {
                      label: "Número",
                      onClick: () =>
                        onGiveTip(player.index, cardIndex, "value"),
                      disabled: card.isValueRevealed,
                    },
                  ];

                  return (
                    <Card
                      key={cardIndex}
                      {...getAnimationProps(player.index, cardIndex)}
                      card={card}
                      anchorTop={player.isMe}
                      isMe={player.isMe}
                      options={player.isMe ? myHandOptions : otherHandOptions}
                      showTips={!player.isMe && !state.isGameFinished}
                      isValueRevealed={card.isValueRevealed}
                      isColorRevealed={card.isColorRevealed}
                      deckSize={state.deckSize}
                      disabled={
                        Boolean(event) ||
                        state.isGameFinished ||
                        !isMyTurn ||
                        (!player.isMe && state.tips <= 0)
                      }
                    />
                  );
                })}

                <span className="card-draw-slot" />
              </Hand>
            );
          })}
        </ul>
      </section>

      <Board state={state} />
    </main>
  );
};
