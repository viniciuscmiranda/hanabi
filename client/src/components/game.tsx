import { useMemo } from "react";
import type { GameState, Card, Me, OtherPlayer } from "../../../core/types";

const valueMap: Record<Card.VALUE, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
};

type GameProps = {
  state: GameState;
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
  onPlayCard,
  onDiscardCard,
  onGiveTip,
}: GameProps) => {
  const [me, ...otherPlayers] = useMemo(() => {
    type WithIndex<T> = T & { index: number };

    const players = state.players.map((p, index) => ({ ...p, index }));

    while (players.findIndex((player) => player.isMe) > 0) {
      players.push(players.shift()!);
    }

    return [
      players[0] as WithIndex<Me>,
      ...(players.slice(1) as WithIndex<OtherPlayer>[]),
    ];
  }, [state.players]);

  const isMyTurn = state.currentPlayerIndex === me.index;

  return (
    <main className="game">
      <section className="players">
        <ul>
          {otherPlayers.map((player) => (
            <li
              key={player.index}
              className="player"
              data-current={
                state.currentPlayerIndex === player.index ? "true" : undefined
              }
            >
              <h3>
                {player.name} ({player.index + 1})
              </h3>
              <ul className="hand">
                {player.hand.map((card, index) => (
                  <li key={index}>
                    <button
                      className="card"
                      data-color={card.color}
                      data-value={card.value}
                      disabled={!isMyTurn || state.tips <= 0}
                    >
                      {valueMap[card.value]}
                    </button>

                    <ul className="options">
                      <li>
                        <button
                          onClick={() =>
                            onGiveTip(player.index, index, "color")
                          }
                        >
                          Cor
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            onGiveTip(player.index, index, "value")
                          }
                        >
                          Número
                        </button>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="board">
        <section className="info">
          <span>💡 {state.tips}</span>
          <span>❤️ {state.lives}</span>
          <span>🏆 {state.score}</span>
          <span>🔄 {state.roundNumber}</span>
          <span>🃏 {state.deckSize}</span>
        </section>

        <ul>
          {!state.board.length && <i>Nada</i>}
          {state.board.map((pile, index) => {
            const topCard = pile[0];

            return (
              <li
                key={index}
                className="card"
                data-color={topCard.color}
                data-value={topCard.value}
              >
                {valueMap[topCard.value]}
              </li>
            );
          })}
        </ul>
      </section>

      <section
        className="me player"
        data-current={
          state.currentPlayerIndex === me.index ? "true" : undefined
        }
      >
        <h3>
          {me.name} ({me.index + 1})
        </h3>
        <ul className="hand">
          {me.hand.map((card, index) => (
            <li key={index}>
              <button
                className="card"
                data-color={card.color}
                data-value={card.value}
                disabled={!isMyTurn}
              >
                {card.value ? valueMap[card.value] : "?"}
              </button>

              <ul className="options" data-anchor-top>
                <li>
                  <button onClick={() => onPlayCard(index)}>Jogar</button>
                </li>
                <li>
                  <button onClick={() => onDiscardCard(index)}>
                    Descartar
                  </button>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};
