import type { Player } from "./player";
import type { Deck } from "./deck";
import type { Board } from "./board";
import type { DiscardPile } from "./discard-pile";
import { Rules } from "../rules";
import { Card } from "./card";

export class Game {
  public turnNumber = 0;
  public lives = Rules.MAX_LIVES;
  public tips = Rules.MAX_TIPS;
  public isGameFinished = false;
  public lastPlayerWhoDrewIndex = 0;

  constructor(
    public players: Player[],
    public deck: Deck,
    public board: Board,
    public discardPile: DiscardPile
  ) {
    if (
      this.players.length < Rules.MIN_PLAYERS ||
      this.players.length > Rules.MAX_PLAYERS
    ) {
      throw new Error("Invalid number of players");
    }
  }

  start() {
    this.deck.shuffle();

    const totalCards = Rules.CARDS_BY_AMOUNT_OF_PLAYERS[this.players.length];

    this.players.forEach((player) => {
      for (let i = 0; i < totalCards; i++) {
        player.addCard(this.deck.draw());
      }
    });
  }

  public giveTip(
    player: Player,
    selectedPlayer: Player,
    cardIndex: number,
    info: Card.INFO
  ) {
    if (
      !this.isPlayerTurn(player) ||
      this.tips <= 0 ||
      player === selectedPlayer
    ) {
      return;
    }

    const selectedCard = selectedPlayer.getCardByIndex(cardIndex);
    if (!selectedCard) return;

    const isColorTip = info === "color";
    const isValueTip = info === "value";

    if (selectedCard.color === "colorless" && isColorTip) {
      return;
    }

    this.tips--;
    selectedPlayer.hand.forEach((card) => {
      const isSameValue = card.value === selectedCard.value;
      const isSameColor = card.color === selectedCard.color;

      if ((isValueTip && isSameValue) || (isColorTip && isSameColor)) {
        card.reveal(info);
      }
    });

    if (this.checkGameFinished()) return;
    this.endTurn();
  }

  public playCard(player: Player, cardIndex: number) {
    if (!this.isPlayerTurn(player)) return;

    const playedCard = player.getCardByIndex(cardIndex);
    if (!playedCard) return;

    player.removeCard(playedCard);
    const wasAddedToBoard = this.board.add(playedCard);

    if (!wasAddedToBoard) {
      this.discardPile.add(playedCard);
      this.lives--;
    } else if (
      this.board.isPileFinished(playedCard.color) &&
      this.tips < Rules.MAX_TIPS
    ) {
      this.tips++;
    }

    if (this.checkGameFinished()) return;
    this.drawCard(player);
    this.endTurn();
  }

  public discardCard(player: Player, cardIndex: number) {
    if (!this.isPlayerTurn(player)) return;

    const discardedCard = player.getCardByIndex(cardIndex);
    if (!discardedCard) return;

    player.removeCard(discardedCard);
    this.discardPile.add(discardedCard);

    if (this.tips < Rules.MAX_TIPS) this.tips++;

    if (this.checkGameFinished()) return;
    this.drawCard(player);
    this.endTurn();
  }

  private drawCard(player: Player) {
    if (!this.isPlayerTurn(player) || this.deck.amountOfCards <= 0) return;
    const drawnCard = this.deck.draw();
    player.addCard(drawnCard);
    this.lastPlayerWhoDrewIndex = this.players.indexOf(player);
  }

  private checkGameFinished() {
    const livesEnded = this.lives <= 0;
    const deckEnded = this.deck.amountOfCards <= 0;
    const lastPlayerWhoDrewPlayed =
      this.lastPlayerWhoDrewIndex === this.currentPlayerIndex;

    this.isGameFinished = livesEnded || (deckEnded && lastPlayerWhoDrewPlayed);
    return this.isGameFinished;
  }

  private endTurn() {
    this.turnNumber++;
  }

  private isPlayerTurn(player: Player) {
    return this.currentPlayerIndex === this.players.indexOf(player);
  }

  public get currentPlayerIndex() {
    return this.turnNumber % this.players.length;
  }

  public get roundNumber() {
    return Math.floor(this.turnNumber / this.players.length) + 1;
  }
}
