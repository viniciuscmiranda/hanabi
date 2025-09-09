import { Card } from "./card";

export class DiscardPile {
  public cards: Card[] = [];

  public add(card: Card) {
    this.cards.push(card);
  }
}
