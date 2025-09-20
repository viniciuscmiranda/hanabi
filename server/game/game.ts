import type { Log, Expansion } from "../../core/types";

import type { Player } from "./player";
import type { Deck } from "./deck";
import type { Board } from "./board";
import type { DiscardPile } from "./discard-pile";
import { Rules } from "../rules";
import { Card } from "./card";
import { Format } from "../utils/format";

export class Game {
  public turnNumber = 0;
  public lives = Rules.MAX_LIVES;
  public tips = Rules.MAX_TIPS;
  public isGameFinished = false;
  public playerWhoDrewLastCard: Player | null = null;
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
      throw new Error(
        `Número de jogadores deve ser entre ${Rules.MIN_PLAYERS} e ${Rules.MAX_PLAYERS}.`
      );
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
    this.throwIfPlayerCannotPlay(player);

    if (this.tips <= 0) throw new Error("Você não tem mais dicas.");
    if (player === selectedPlayer) {
      throw new Error("Você não pode dar uma dica para si mesmo.");
    }

    const selectedCard = selectedPlayer.getCardByIndex(cardIndex);

    const isColorTip = info === "color";
    const isValueTip = info === "value";

    if (selectedCard.color === "colorless" && isColorTip) {
      throw new Error("Você não pode dar uma dica para uma carta sem cor.");
    }

    const cardsToReveal = selectedPlayer.hand.filter((card) => {
      const isSameValue = card.value === selectedCard.value;
      const isSameColor = card.color === selectedCard.color;

      return (isValueTip && isSameValue) || (isColorTip && isSameColor);
    });

    this.tips--;
    cardsToReveal.forEach((card) => card.reveal(info));

    this.log(
      `💡 ${player.name} deu a dica ${Format.info(info, selectedCard)} em ${
        cardsToReveal.length
      } cartas para ${selectedPlayer.name} (Restam ${this.tips}/${
        Rules.MAX_TIPS
      }).`
    );

    if (!this.checkGameFinished()) {
      this.endTurn();
    }

    return cardsToReveal.map((card) => ({
      index: selectedPlayer.hand.indexOf(card),
      card,
    }));
  }

  public playCard(player: Player, cardIndex: number) {
    this.throwIfPlayerCannotPlay(player);

    const playedCard = player.getCardByIndex(cardIndex);
    this.log(`🃏 ${player.name} jogou ${Format.card(playedCard)}.`);

    player.removeCard(playedCard);
    const wasAddedToTheBoard = this.board.add(playedCard);

    if (!wasAddedToTheBoard) {
      this.discardPile.add(playedCard);
      this.loseLife();
    } else if (this.board.isPileFinished(playedCard.color)) {
      this.addTip();
    }

    let drawnCard: Card | undefined;
    if (!this.checkGameFinished()) {
      drawnCard = this.drawCard(player);
      this.endTurn();
    }

    return { wasAddedToTheBoard, drawnCard, playedCard };
  }

  public discardCard(player: Player, cardIndex: number) {
    this.throwIfPlayerCannotPlay(player);

    const discardedCard = player.getCardByIndex(cardIndex);
    discardedCard.reveal("value");
    discardedCard.reveal("color");

    this.log(`🗑️ ${player.name} descartou ${Format.card(discardedCard)}.`);

    player.removeCard(discardedCard);
    this.discardPile.add(discardedCard);

    this.addTip();

    let drawnCard: Card | undefined;

    if (!this.checkGameFinished()) {
      drawnCard = this.drawCard(player);
      this.endTurn();
    }

    return { discardedCard, drawnCard };
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
    if (this.deck.amountOfCards <= 0) return;

    const drawnCard = this.deck.draw();
    player.addCard(drawnCard);
    this.playerWhoDrewLastCard = player;

    this.log(
      `🃏 ${player.name} comprou uma carta. (Restam ${this.deck.amountOfCards}).`
    );

    return drawnCard;
  }

  private endTurn() {
    this.turnNumber++;
    this.log(
      `🔄 Turno de ${this.currentPlayer.name} (Rodada ${this.roundNumber}).`
    );
  }

  private checkGameFinished() {
    const livesEnded = this.lives <= 0;
    const deckEnded = this.deck.amountOfCards <= 0;
    const playerWhoDrewLastCardPlayedAgain =
      this.playerWhoDrewLastCard === this.currentPlayer;

    this.isGameFinished =
      livesEnded ||
      (deckEnded && playerWhoDrewLastCardPlayedAgain) ||
      this.board.isAllPilesFinished();

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

  private loseLife() {
    this.lives--;
    this.log(
      `💔 ${this.currentPlayer.name} perdeu uma vida (Restam ${this.lives}/${Rules.MAX_LIVES}).`
    );
  }

  private addTip() {
    if (this.tips < Rules.MAX_TIPS) {
      this.tips++;
      this.log(
        `💡 ${this.currentPlayer.name} ganhou uma dica (Restam ${this.tips}/${Rules.MAX_TIPS}).`
      );
    }
  }

  private throwIfPlayerCannotPlay(player: Player) {
    if (this.isGamePaused) throw new Error("O jogo está pausado.");
    if (this.currentPlayer !== player)
      throw new Error(`É o turno de ${this.currentPlayer.name}.`);
    return true;
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
