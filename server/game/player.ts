import { Card } from "./card";

export class Player {
  public hand: Card[] = [];
  public isReady = false;

  constructor(public name: string) {}

  public addCard(card: Card) {
    this.hand.push(card);
  }

  public removeCard(card: Card) {
    const cardIndex = this.hand.indexOf(card);
    this.hand.splice(cardIndex, 1);
  }

  public getCardByIndex(cardIndex: number) {
    return this.hand.at(cardIndex);
  }
}
