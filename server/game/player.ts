import { generatePlayerName } from "../utils/generate-player-name";
import { Card } from "./card";

export class Player {
  public hand: Card[] = [];
  public isReady = false;
  public isConnected = true;
  public isWatching = false;
  public name: string;

  constructor() {
    this.rename();
  }

  public rename() {
    this.name = generatePlayerName();
  }

  public addCard(card: Card) {
    this.hand.push(card);
  }

  public removeCard(card: Card) {
    const cardIndex = this.hand.indexOf(card);
    this.hand.splice(cardIndex, 1);
  }

  public getCardByIndex(cardIndex: number) {
    const card = this.hand.at(cardIndex);
    if (!card) throw new Error("Carta não encontrada.");
    return card;
  }

  public discardHand() {
    this.hand = [];
  }
}
