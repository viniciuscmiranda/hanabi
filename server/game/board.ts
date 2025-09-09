import { Rules } from "../rules";
import { Card } from "./card";

export class Board {
  private piles: Map<Card.COLOR, Card[]> = new Map();

  public add(card: Card) {
    const pile = this.piles.get(card.color) || [];
    const topCard = pile.at(0);

    const orderedPile = Rules.ORDERED_CARD_VALUES_BY_COLOR[card.color];
    const nextCardValue = topCard
      ? orderedPile[orderedPile.indexOf(topCard.value) + 1]
      : orderedPile[0];

    if (card.value !== nextCardValue) return false;

    pile.unshift(card);
    this.piles.set(card.color, pile);
    return true;
  }

  public getPileCards(color: Card.COLOR) {
    return this.piles.get(color) || [];
  }

  public getPiles() {
    return Array.from(this.piles.values());
  }

  public isPileFinished(color: Card.COLOR) {
    return (
      this.getPileCards(color).length ===
      Rules.ORDERED_CARD_VALUES_BY_COLOR[color].length
    );
  }

  public get score() {
    return this.getPiles().reduce((acc, pile) => {
      return acc + pile.length;
    }, 0);
  }
}
