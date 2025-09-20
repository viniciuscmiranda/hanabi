import type { WebSocket } from "ws";

import type { Player } from "../game/player";
import type { Card } from "../game/card";
import type { Room } from "../game/room";

import type { GameEvent } from "../../core/types";

export class Messenger {
  constructor(private room: Room) {}

  public static sendError(error: Error, ws: WebSocket) {
    const message: GameEvent = {
      event: "ERROR",
      payload: { error: error.message },
    };

    ws.send(JSON.stringify(message));
  }

  public sendError(error: Error, ws?: WebSocket) {
    this.room.clients.forEach((client) => {
      if (!client.ws || (ws && client.ws !== ws)) return;
      Messenger.sendError(error, client.ws);
    });
  }

  private send(
    event: (player: Player, clientIndex: number) => GameEvent,
    ws?: WebSocket
  ) {
    this.room.clients.forEach((client, clientIndex) => {
      if (ws && client.ws !== ws) return;
      const data = event(client.player, clientIndex);
      client.ws?.send(JSON.stringify(data));
    });
  }

  public sendPlayerReact(reaction: string, ws?: WebSocket) {
    this.send(
      () => ({
        event: "PLAYER_REACT",
        payload: { reaction },
      }),
      ws
    );
  }

  public sendPlayerPlay(
    playerIndex: number,
    cardIndex: number,
    success: boolean,
    card: Card,
    drawnCard?: Card,
    ws?: WebSocket
  ) {
    this.send(
      (player, index) => ({
        event: "PLAYER_PLAY",
        payload: {
          gameState: this.getGameState(player),
          playerIndex,
          cardIndex,
          success,
          card: {
            value: card.value,
            color: card.color,
            isValueRevealed: card.isValueRevealed,
            isColorRevealed: card.isColorRevealed,
          },
          drawnCard:
            playerIndex !== index && drawnCard
              ? {
                  value: drawnCard.value,
                  color: drawnCard.color,
                  isValueRevealed: drawnCard.isValueRevealed,
                  isColorRevealed: drawnCard.isColorRevealed,
                }
              : undefined,
        },
      }),
      ws
    );
  }

  public sendPlayerDiscard(
    playerIndex: number,
    cardIndex: number,
    card: Card,
    drawnCard?: Card,
    ws?: WebSocket
  ) {
    this.send(
      (player, index) => ({
        event: "PLAYER_DISCARD",
        payload: {
          gameState: this.getGameState(player),
          playerIndex,
          cardIndex,
          drawnCard:
            playerIndex !== index && drawnCard
              ? {
                  value: drawnCard.value,
                  color: drawnCard.color,
                  isValueRevealed: drawnCard.isValueRevealed,
                  isColorRevealed: drawnCard.isColorRevealed,
                }
              : undefined,
          card: {
            value: card.value,
            color: card.color,
            isValueRevealed: card.isValueRevealed,
            isColorRevealed: card.isColorRevealed,
          },
        },
      }),
      ws
    );
  }

  public sendPlayerGiveTip(
    playerIndex: number,
    selectedPlayerIndex: number,
    cardIndex: number,
    cards: { index: number; card: Card }[],
    info: Card.INFO,
    ws?: WebSocket
  ) {
    this.send(
      (player, pIndex) => ({
        event: "PLAYER_GIVE_TIP",
        payload: {
          gameState: this.getGameState(player),
          playerIndex,
          selectedPlayerIndex,
          cardIndex,
          cards: cards.map(({ index, card }) => ({
            index: index,
            value:
              selectedPlayerIndex !== pIndex || card.isValueRevealed
                ? card.value
                : null,
            color:
              selectedPlayerIndex !== pIndex || card.isColorRevealed
                ? card.color
                : null,
            isValueRevealed: card.isValueRevealed,
            isColorRevealed: card.isColorRevealed,
          })),
          info,
        },
      }),
      ws
    );
  }

  public sendRoomState(ws?: WebSocket) {
    this.send(
      (player) => ({
        event: "ROOM_UPDATE",
        payload: {
          roomId: this.room.id,
          settings: {
            expansions: this.room.expansions,
            allowWatchMode: this.room.allowWatchMode,
            isPublic: this.room.isPublic,
          },
          players: this.room.players.map((p) => ({
            isMe: p === player,
            ready: p.isReady,
            name: p.name,
            isWatching: p.isWatching,
            isLeader: p === this.room.leader,
          })),
        },
      }),
      ws
    );
  }

  public sendGameState(ws?: WebSocket) {
    this.send(
      (player) => ({
        event: "GAME_UPDATE",
        payload: this.getGameState(player),
      }),
      ws
    );
  }

  private getGameState(player: Player) {
    if (!this.room.game) throw new Error("O jogo ainda não começou.");

    return {
      isWatchMode: player.isWatching,
      roomId: this.room.id,
      tips: this.room.game.tips,
      lives: this.room.game.lives,
      deckSize: this.room.game.deck.amountOfCards,
      score: this.room.game.board.score,
      turnNumber: this.room.game.turnNumber,
      roundNumber: this.room.game.roundNumber,
      currentPlayerIndex: this.room.game.currentPlayerIndex,
      isGameFinished: this.room.game.isGameFinished,
      isGamePaused: this.room.game.isGamePaused,
      expansions: this.room.game.board.expansions,
      discardPile: this.room.game.discardPile.cards,
      board: this.room.game.board.getPiles(),
      logs: this.room.game.logs,
      players: this.room.playersInGame.map((p) => {
        const isMe = p === player;

        return {
          isMe,
          name: p.name,
          isLeader: p === this.room.leader,
          hand: p.hand.map((card) => {
            const canSeeValue = isMe ? card.isValueRevealed : true;
            const canSeeColor = isMe ? card.isColorRevealed : true;

            const value = canSeeValue ? card.value : null;
            const color = canSeeColor ? card.color : null;

            return {
              ...card,
              value: value as Card.VALUE,
              color: color as Card.COLOR,
            };
          }),
        };
      }),
    };
  }
}
