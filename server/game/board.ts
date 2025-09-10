import type { Expansion } from "../../core/types";

import { Rules } from "../rules";
import { Card } from "./card";

const mapValueToPoints: Record<Card.VALUE, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

export class Board {
  private piles: Map<Card.COLOR, Card[]> = new Map();

  constructor(public expansions: Expansion[]) {}

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

  public getPileByColor(color: Card.COLOR) {
    return this.piles.get(color) || [];
  }

  public getPiles() {
    return Array.from(this.piles.values());
  }

  public isPileFinished(color: Card.COLOR) {
    return (
      this.getPileByColor(color).length ===
      Rules.ORDERED_CARD_VALUES_BY_COLOR[color].length
    );
  }

  public isAllPilesFinished() {
    const colors: Card.COLOR[] = ["red", "green", "blue", "yellow", "white"];

    if (this.expansions.includes("avalanche_of_colors")) {
      colors.push("multicolor");
    }

    if (this.expansions.includes("black_powder")) {
      colors.push("colorless");
    }

    return colors.every((color) => this.isPileFinished(color));
  }

  public get score() {
    const score = this.getPiles().reduce((acc, pile) => {
      const top = pile[0];
      if (top.color === "colorless") return acc;

      const points = mapValueToPoints[top.value];

      return acc + points;
    }, 0);

    if (this.expansions.includes("black_powder")) {
      const colorlessPile = this.getPileByColor("colorless");
      const missingCards =
        Rules.ORDERED_CARD_VALUES_BY_COLOR["colorless"].length -
        colorlessPile.length;

      return score - missingCards;
    }

    return score;
  }
}
