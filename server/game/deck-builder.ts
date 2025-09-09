import { Card } from "./card";
import type { Expansion } from "../../core/types";

const Decks: Record<Card.COLOR, Card[]> = {
  red: [
    new Card("one", "red"),
    new Card("one", "red"),
    new Card("one", "red"),
    new Card("two", "red"),
    new Card("two", "red"),
    new Card("three", "red"),
    new Card("three", "red"),
    new Card("four", "red"),
    new Card("four", "red"),
    new Card("five", "red"),
  ],
  green: [
    new Card("one", "green"),
    new Card("one", "green"),
    new Card("one", "green"),
    new Card("two", "green"),
    new Card("two", "green"),
    new Card("three", "green"),
    new Card("three", "green"),
    new Card("four", "green"),
    new Card("four", "green"),
    new Card("five", "green"),
  ],
  blue: [
    new Card("one", "blue"),
    new Card("one", "blue"),
    new Card("one", "blue"),
    new Card("two", "blue"),
    new Card("two", "blue"),
    new Card("three", "blue"),
    new Card("three", "blue"),
    new Card("four", "blue"),
    new Card("four", "blue"),
    new Card("five", "blue"),
  ],
  yellow: [
    new Card("one", "yellow"),
    new Card("one", "yellow"),
    new Card("one", "yellow"),
    new Card("two", "yellow"),
    new Card("two", "yellow"),
    new Card("three", "yellow"),
    new Card("three", "yellow"),
    new Card("four", "yellow"),
    new Card("four", "yellow"),
    new Card("five", "yellow"),
  ],
  white: [
    new Card("one", "white"),
    new Card("one", "white"),
    new Card("one", "white"),
    new Card("two", "white"),
    new Card("two", "white"),
    new Card("three", "white"),
    new Card("three", "white"),
    new Card("four", "white"),
    new Card("four", "white"),
    new Card("five", "white"),
  ],
  multicolor: [
    new Card("one", "multicolor"),
    new Card("one", "multicolor"),
    new Card("one", "multicolor"),
    new Card("two", "multicolor"),
    new Card("two", "multicolor"),
    new Card("three", "multicolor"),
    new Card("three", "multicolor"),
    new Card("four", "multicolor"),
    new Card("four", "multicolor"),
    new Card("five", "multicolor"),
  ],
  colorless: [
    new Card("one", "colorless"),
    new Card("two", "colorless"),
    new Card("two", "colorless"),
    new Card("three", "colorless"),
    new Card("three", "colorless"),
    new Card("four", "colorless"),
    new Card("four", "colorless"),
    new Card("five", "colorless"),
    new Card("five", "colorless"),
    new Card("five", "colorless"),
  ],
};

export class DeckBuilder {
  static build(...expansions: Expansion[]) {
    const cards: Card[] = [];

    cards.push(
      ...Decks.red,
      ...Decks.green,
      ...Decks.blue,
      ...Decks.yellow,
      ...Decks.white
    );

    if (expansions.includes("avalanche_of_colors")) {
      cards.push(...Decks.multicolor);
    }

    if (expansions.includes("black_powder")) {
      cards.push(...Decks.colorless);
    }

    return cards;
  }
}
