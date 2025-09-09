import { useState } from "react";

import type { GameState, Card as CardType } from "../../../core/types";
import { Card } from "./card";

type BoardProps = {
  state: GameState;
};

const valueOrder: CardType.VALUE[] = ["one", "two", "three", "four", "five"];

export const Board = ({ state }: BoardProps) => {
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const discardPile = [...state.discardPile]
    .sort((a, b) => {
      return valueOrder.indexOf(a.value) - valueOrder.indexOf(b.value);
    })
    .reduce((acc, card) => {
      if (!acc[card.color]) acc[card.color] = [];
      acc[card.color].push(card);
      return acc;
    }, {} as Record<CardType.COLOR, CardType[]>);

  return (
    <>
      <section className="board-container">
        <section className="board">
          <section className="info">
            <span>💡 {state.tips}</span>
            <span>❤️ {state.lives}</span>
            <span>🏆 {state.score}</span>
            <span>🔄 {state.roundNumber}</span>
            <span>🃏 {state.deckSize}</span>
          </section>

          {!state.board.length && <i>Nada</i>}

          <ul>
            {state.board.map((pile, index) => (
              <Card key={index} card={pile[0]} disabled />
            ))}
          </ul>
        </section>

        <section className="discard" onClick={() => setShowDiscardModal(true)}>
          <section className="info">
            <span>🃏 {state.discardPile.length}</span>
          </section>
          {!state.discardPile.length && <i>Nada</i>}
          <ul>
            {Object.values(discardPile).length > 0 && (
              <Card card={state.discardPile.at(-1)!} disabled={false} />
            )}
          </ul>
        </section>
      </section>

      {showDiscardModal && !state.isGameFinished && (
        <section
          className="discard-modal"
          onClick={() => setShowDiscardModal(false)}
        >
          <h2>Descarte</h2>

          <ul>
            {Object.values(discardPile).map((cards, index) => {
              return (
                <li key={index}>
                  <ul>
                    {cards.map((card, index) => (
                      <Card key={index} card={card} disabled />
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
};
