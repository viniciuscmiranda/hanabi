import { WebSocketServer } from "ws";

import { Game } from "./game/game";
import { DeckBuilder } from "./game/deck-builder";
import { Player } from "./game/player";
import { Board } from "./game/board";
import { DiscardPile } from "./game/discard-pile";
import { Deck } from "./game/deck";
import { Rules } from "./rules";
import type { PlayerEvent } from "../core/types";

import { Global } from "./global";
import { Message } from "./message";
import { generateName } from "./names";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  const connectedClients = Global.clients.filter((client) => client.ws);

  if (connectedClients.length >= Rules.MAX_PLAYERS) {
    Message.sendError(ws, "A sala está cheia.");
    ws.close();
    return;
  }

  const disconnectedClient = Global.clients.find((client) => !client.ws);

  if (Global.game && !disconnectedClient) {
    Message.sendError(ws, "O jogo já começou.");
    ws.close();
    return;
  }

  const player = (() => {
    if (disconnectedClient && Global.game && !Global.game.isGameFinished) {
      disconnectedClient.ws = ws;

      const player = disconnectedClient.player;
      const newName = generateName();

      Global.game.log(
        `👋 ${newName} entrou no jogo no lugar de ${player.name}.`
      );

      player.isConnected = true;
      player.name = newName;
      Message.sendGameUpdate();

      return player;
    } else {
      const player = new Player(generateName());

      Global.clients.push({ ws, player });
      Message.sendRoomUpdate();

      return player;
    }
  })();

  console.log(`${player.name} connected`);

  ws.on("message", (raw) => {
    const data = (JSON.parse(raw.toString()) || {}) as PlayerEvent;
    const { event, payload } = data;

    Global.game = Global.game!;

    switch (event) {
      case "PLAYER_PLAY":
        Global.game.playCard(player, payload.cardIndex);
        Message.sendGameUpdate();
        break;
      case "PLAYER_DISCARD":
        Global.game.discardCard(player, payload.cardIndex);
        Message.sendGameUpdate();
        break;
      case "PLAYER_GIVE_TIP":
        const selectedPlayer = Global.clients.at(payload.playerIndex)?.player;
        if (!selectedPlayer) return;

        Global.game.giveTip(
          player,
          selectedPlayer,
          payload.cardIndex,
          payload.info
        );

        Message.sendGameUpdate();
        break;
      case "PLAYER_READY":
        player.isReady = true;
        Message.sendRoomUpdate();

        if (
          !Global.game &&
          Global.clients.length >= Rules.MIN_PLAYERS &&
          Global.clients.every((client) => client.player.isReady)
        ) {
          const players = Global.clients.map((client) => client.player);
          const cards = DeckBuilder.build();

          Global.game = new Game(
            players,
            new Deck(cards),
            new Board(),
            new DiscardPile()
          );

          Global.game.start();
          Message.sendGameUpdate();
        }
        break;

      case "PLAYER_RENAME":
        if (Global.game) return;
        player.selfRename();
        Message.sendRoomUpdate();
        break;
    }

    if (Global.game && Global.game.isGameFinished) {
      Global.game = null;
      Global.clients.forEach((client) => {
        client.player.isReady = false;
      });
    }
  });

  Message.sendRoomUpdate();

  ws.on("close", () => {
    console.log(`${player.name} disconnected`);

    if (Global.game) {
      const connectedClients = Global.clients.filter((client) => client.ws);

      if (connectedClients.length > 1) {
        Global.clients = Global.clients.map((client) => {
          if (client.player === player) client.ws = null;
          return client;
        });

        player.isConnected = false;

        Global.game.log(`🚪 ${player.name} saiu do jogo.`);
        Message.sendGameUpdate();
        Message.sendRoomUpdate();
      } else {
        Global.game = null;
        Global.clients = [];
      }

      return;
    }

    Global.clients = Global.clients.filter(
      (client) => client.player !== player
    );
    Global.clients.forEach((client) => {
      client.player.isReady = false;
    });

    Message.sendRoomUpdate();
  });
});

console.log("Server is running on port 8080");
