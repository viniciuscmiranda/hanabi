import { Card } from "./card";

export class Deck {
  constructor(private cards: Card[]) {}

  public shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  public draw() {
    if (this.cards.length <= 0) throw new Error("Deck is empty");
    return this.cards.shift()!;
  }

  public get amountOfCards() {
    return this.cards.length;
  }
}
