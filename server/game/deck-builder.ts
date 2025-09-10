import { Card } from "./card";
import type { Expansion } from "../../core/types";

type CardProps = {
  value: Card.VALUE;
  color: Card.COLOR;
};

const Decks: Record<Card.COLOR, CardProps[]> = {
  red: [
    { value: "one", color: "red" },
    { value: "one", color: "red" },
    { value: "two", color: "red" },
    { value: "two", color: "red" },
    { value: "three", color: "red" },
    { value: "three", color: "red" },
    { value: "four", color: "red" },
    { value: "four", color: "red" },
    { value: "five", color: "red" },
  ],
  green: [
    { value: "one", color: "green" },
    { value: "one", color: "green" },
    { value: "one", color: "green" },
    { value: "two", color: "green" },
    { value: "two", color: "green" },
    { value: "three", color: "green" },
    { value: "three", color: "green" },
    { value: "four", color: "green" },
    { value: "four", color: "green" },
    { value: "five", color: "green" },
  ],
  blue: [
    { value: "one", color: "blue" },
    { value: "one", color: "blue" },
    { value: "one", color: "blue" },
    { value: "two", color: "blue" },
    { value: "two", color: "blue" },
    { value: "three", color: "blue" },
    { value: "three", color: "blue" },
    { value: "four", color: "blue" },
    { value: "four", color: "blue" },
    { value: "five", color: "blue" },
  ],
  yellow: [
    { value: "one", color: "yellow" },
    { value: "one", color: "yellow" },
    { value: "one", color: "yellow" },
    { value: "two", color: "yellow" },
    { value: "two", color: "yellow" },
    { value: "three", color: "yellow" },
    { value: "three", color: "yellow" },
    { value: "four", color: "yellow" },
    { value: "four", color: "yellow" },
    { value: "five", color: "yellow" },
  ],
  white: [
    { value: "one", color: "white" },
    { value: "one", color: "white" },
    { value: "one", color: "white" },
    { value: "two", color: "white" },
    { value: "two", color: "white" },
    { value: "three", color: "white" },
    { value: "three", color: "white" },
    { value: "four", color: "white" },
    { value: "four", color: "white" },
    { value: "five", color: "white" },
  ],
  multicolor: [
    { value: "one", color: "multicolor" },
    { value: "one", color: "multicolor" },
    { value: "one", color: "multicolor" },
    { value: "two", color: "multicolor" },
    { value: "two", color: "multicolor" },
    { value: "three", color: "multicolor" },
    { value: "three", color: "multicolor" },
    { value: "four", color: "multicolor" },
    { value: "four", color: "multicolor" },
    { value: "five", color: "multicolor" },
  ],
  colorless: [
    { value: "one", color: "colorless" },
    { value: "two", color: "colorless" },
    { value: "two", color: "colorless" },
    { value: "three", color: "colorless" },
    { value: "three", color: "colorless" },
    { value: "four", color: "colorless" },
    { value: "four", color: "colorless" },
    { value: "five", color: "colorless" },
    { value: "five", color: "colorless" },
    { value: "five", color: "colorless" },
  ],
};

export class DeckBuilder {
  static build(expansions: Expansion[]) {
    const cards: Card[] = [];

    cards.push(
      ...Decks.red.map(this.buildCard),
      ...Decks.green.map(this.buildCard),
      ...Decks.blue.map(this.buildCard),
      ...Decks.yellow.map(this.buildCard),
      ...Decks.white.map(this.buildCard)
    );

    if (expansions.includes("avalanche_of_colors")) {
      cards.push(...Decks.multicolor.map(this.buildCard));
    }

    if (expansions.includes("black_powder")) {
      cards.push(...Decks.colorless.map(this.buildCard));
    }

    return cards;
  }

  private static buildCard(card: CardProps) {
    return new Card(card.value, card.color);
  }
}
