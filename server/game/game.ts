import type { Log, Expansion } from "../../core/types";

import type { Player } from "./player";
import type { Deck } from "./deck";
import type { Board } from "./board";
import type { DiscardPile } from "./discard-pile";
import { Rules } from "../rules";
import { Card } from "./card";
import { Readable } from "../utils/readable";

export class Game {
  public turnNumber = 0;
  public lives = Rules.MAX_LIVES;
  public tips = Rules.MAX_TIPS;
  public isGameFinished = false;
  public lastPlayerWhoDrewIndex = 0;
  public logs: Log[] = [];

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

  public start() {
    this.deck.shuffle();

    const totalCards = Rules.CARDS_BY_AMOUNT_OF_PLAYERS[this.players.length];
    this.log(`🎲 Início do jogo. Cada jogador recebeu ${totalCards} cartas.`);

    this.players.forEach((player) => {
      for (let i = 0; i < totalCards; i++) {
        player.addCard(this.deck.draw());
      }
    });

    this.log(
      `🔄 Turno de ${this.currentPlayer.name} (Rodada ${this.roundNumber}).`
    );
  }

  public giveTip(
    player: Player,
    selectedPlayer: Player,
    cardIndex: number,
    info: Card.INFO
  ) {
    if (
      this.isGamePaused ||
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
    const cardsToReveal = selectedPlayer.hand.filter((card) => {
      const isSameValue = card.value === selectedCard.value;
      const isSameColor = card.color === selectedCard.color;

      return (isValueTip && isSameValue) || (isColorTip && isSameColor);
    });

    cardsToReveal.forEach((card) => {
      card.reveal(info);
    });

    this.log(
      `💡 ${player.name} deu a dica ${Readable.info(info, selectedCard)} em ${
        cardsToReveal.length
      } cartas para ${selectedPlayer.name} (Restam ${this.tips}/${
        Rules.MAX_TIPS
      }).`
    );

    if (this.checkGameFinished()) return;
    this.endTurn();
  }

  public playCard(player: Player, cardIndex: number) {
    if (this.isGamePaused || !this.isPlayerTurn(player)) return;

    const playedCard = player.getCardByIndex(cardIndex);
    if (!playedCard) return;

    this.log(`🃏 ${player.name} jogou ${Readable.card(playedCard)}.`);

    player.removeCard(playedCard);
    const wasAddedToTheBoard = this.board.add(playedCard);

    if (!wasAddedToTheBoard) {
      this.discardPile.add(playedCard);
      this.lives--;
      this.log(
        `💔 ${player.name} perdeu uma vida (Restam ${this.lives}/${Rules.MAX_LIVES}).`
      );
    } else if (
      this.board.isPileFinished(playedCard.color) &&
      this.tips < Rules.MAX_TIPS
    ) {
      this.tips++;
      this.log(
        `💡 ${player.name} ganhou uma dica (Restam ${this.tips}/${Rules.MAX_TIPS}).`
      );
    }

    if (this.checkGameFinished()) return;
    this.drawCard(player);
    this.endTurn();
  }

  public discardCard(player: Player, cardIndex: number) {
    if (this.isGamePaused || !this.isPlayerTurn(player)) return;

    const discardedCard = player.getCardByIndex(cardIndex);
    if (!discardedCard) return;

    this.log(`🃏 ${player.name} descartou ${Readable.card(discardedCard)}.`);

    player.removeCard(discardedCard);
    this.discardPile.add(discardedCard);

    if (this.tips < Rules.MAX_TIPS) {
      this.tips++;
      this.log(
        `💡 ${player.name} ganhou uma dica (Restam ${this.tips}/${Rules.MAX_TIPS}).`
      );
    }

    if (this.checkGameFinished()) return;
    this.drawCard(player);
    this.endTurn();
  }

  public disconnectPlayer(player: Player) {
    player.isConnected = false;
    this.log(`🚪 ${player.name} saiu do jogo.`);
  }

  public replacePlayer(oldPlayer: Player, newPlayer: Player) {
    newPlayer.hand = oldPlayer.hand;
    newPlayer.isReady = true;
    newPlayer.isConnected = true;
    this.players.splice(this.players.indexOf(oldPlayer), 1, newPlayer);

    this.log(
      `👋 ${newPlayer.name} entrou no jogo no lugar de ${oldPlayer.name}.`
    );
  }

  private drawCard(player: Player) {
    if (
      this.isGamePaused ||
      !this.isPlayerTurn(player) ||
      this.deck.amountOfCards <= 0
    ) {
      return;
    }

    const drawnCard = this.deck.draw();
    player.addCard(drawnCard);
    this.lastPlayerWhoDrewIndex = this.players.indexOf(player);
    this.log(
      `🃏 ${player.name} comprou uma carta. (Restam ${this.deck.amountOfCards}).`
    );
  }

  private checkGameFinished() {
    const livesEnded = this.lives <= 0;
    const deckEnded = this.deck.amountOfCards <= 0;
    const lastPlayerWhoDrewPlayedAgain =
      this.lastPlayerWhoDrewIndex === this.currentPlayerIndex;

    this.isGameFinished =
      livesEnded ||
      this.board.isAllPilesFinished() ||
      (deckEnded && lastPlayerWhoDrewPlayedAgain);

    if (this.isGameFinished) {
      this.players.forEach((player) => {
        player.hand.forEach((card) => {
          card.reveal("value");
          card.reveal("color");
        });
      });

      this.log(`🎉 Fim de jogo! (Pontuação: ${this.board.score}).`);
    }

    return this.isGameFinished;
  }

  private endTurn() {
    this.turnNumber++;
    this.log(
      `🔄 Turno de ${this.currentPlayer.name} (Rodada ${this.roundNumber}).`
    );
  }

  private isPlayerTurn(player: Player) {
    return this.currentPlayerIndex === this.players.indexOf(player);
  }

  private log(message: string) {
    this.logs.unshift({ timestamp: new Date().toISOString(), message });
  }

  public get currentPlayerIndex() {
    return this.turnNumber % this.players.length;
  }

  public get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  public get roundNumber() {
    return Math.floor(this.turnNumber / this.players.length) + 1;
  }

  public get isGamePaused() {
    return this.players.some((player) => !player.isConnected);
  }
}
