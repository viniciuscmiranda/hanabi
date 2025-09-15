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

  private send(event: (player: Player) => GameEvent, ws?: WebSocket) {
    this.room.clients.forEach((client) => {
      if (ws && client.ws !== ws) return;
      const data = event(client.player);
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
    this.send((player) => {
      if (!this.room.game) throw new Error("O jogo ainda não começou.");

      return {
        event: "GAME_UPDATE",
        payload: {
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
        },
      };
    }, ws);
  }
}
