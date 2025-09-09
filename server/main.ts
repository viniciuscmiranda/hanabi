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
  if (Global.clients.length >= Rules.MAX_PLAYERS || Global.game) {
    ws.send(JSON.stringify({ error: "Max players reached!" }));
    ws.close();
    return;
  }

  const player = new Player(generateName());
  const clientIndex = Global.clients.length;
  Global.clients.push({ ws, player });

  Message.sendRoomUpdate();

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
    }

    if (Global.game && Global.game.isGameFinished) {
      Global.game = null;
      Global.clients.forEach((client) => {
        client.player.isReady = false;
      });

      Message.sendRoomUpdate();
    }
  });

  ws.on("close", () => {
    Global.clients.splice(clientIndex, 1);

    Global.clients.forEach((client) => {
      client.player.isReady = false;
    });

    if (Global.game) {
      Global.game = null;
      Message.sendGameStop();
    }

    Message.sendRoomUpdate();
  });
});

console.log("Server is running on port 8080");
