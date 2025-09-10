import type { WebSocket } from "ws";

import { Player } from "./game/player";
import { Card } from "./game/card";
import { Global } from "./global";
import type { GameEvent } from "../core/types";

function send(event: (player: Player) => GameEvent) {
  Global.clients.forEach((client) => {
    const data = event(client.player);
    client.ws?.send(JSON.stringify(data));
  });
}

export const Message = {
  sendGameStop() {
    send(() => ({ event: "GAME_STOP" }));
  },
  sendRoomUpdate() {
    send((player) => ({
      event: "ROOM_UPDATE",
      payload: {
        players: Global.clients.map((c) => ({
          isMe: c.player === player,
          ready: c.player.isReady,
          name: c.player.name,
        })),
      },
    }));
  },
  sendGameUpdate() {
    send((player) => {
      Global.game = Global.game!;

      return {
        event: "GAME_UPDATE",
        payload: {
          tips: Global.game.tips,
          lives: Global.game.lives,
          deckSize: Global.game.deck.amountOfCards,
          score: Global.game.board.score,
          turnNumber: Global.game.turnNumber,
          roundNumber: Global.game.roundNumber,
          currentPlayerIndex: Global.game.currentPlayerIndex,
          isGameFinished: Global.game.isGameFinished,
          isGamePaused: Global.game.isGamePaused,
          expansions: Global.game.board.expansions,
          discardPile: Global.game.discardPile.cards,
          board: Global.game.board.getPiles(),
          logs: Global.game.logs,
          players: Global.clients.map((c) => {
            const isMe = c.player === player;

            return {
              isMe,
              name: c.player.name,
              hand: c.player.hand.map((card) => {
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
    });
  },

  sendError(ws: WebSocket, error: string) {
    ws.send(JSON.stringify({ event: "ERROR", payload: { error } }));
  },
};
