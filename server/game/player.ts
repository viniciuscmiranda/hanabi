import { generateName } from "../names";
import { Card } from "./card";

export class Player {
  public hand: Card[] = [];
  public isReady = false;
  public isConnected = true;

  constructor(public name: string) {}

  public selfRename() {
    this.name = generateName();
  }

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
