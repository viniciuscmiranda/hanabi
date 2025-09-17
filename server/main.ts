import * as http from "node:http";
import { config } from "dotenv";
import { WebSocketServer } from "ws";

import { Room } from "./game/room";
import { validateMessage } from "./utils/validate-message";

import type { Room as RoomType } from "../core/types";
import { Messenger } from "./utils/messenger";

config({ path: "../.env" });

const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map<string, Room>();

function log(context: string, message: string) {
  const timestamp = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  console.log(`${timestamp} - [${context}] ${message}`);
}

const TIMEOUT = Number(process.env.SERVER_WS_CLIENT_TIMEOUT) || 1000 * 60 * 5;

wss.on("connection", (ws, request) => {
  const room = (() => {
    const roomId = request.url?.split("/").at(-1);
    if (roomId) return rooms.get(roomId);

    const room = new Room();
    log(room.id, "Room created");
    rooms.set(room.id, room);
    return room;
  })();

  try {
    if (!room) throw new Error("Sala não encontrada");

    const player = room.connect(ws);
    log(room.id, `${player.name} connected`);
  } catch (error) {
    Messenger.sendError(error, ws);
    ws.close();
    return;
  }

  function initTimeout() {
    return setTimeout(() => {
      Messenger.sendError(new Error("Desconectado por inatividade."), ws);
      ws.close();
    }, TIMEOUT);
  }

  let timeout = initTimeout();

  ws.on("message", (raw) => {
    try {
      const data = validateMessage(JSON.parse(raw.toString()));
      room.handlePlayerEvent(ws, data);

      clearTimeout(timeout);
      timeout = initTimeout();
    } catch (error) {
      Messenger.sendError(error, ws);
      ws.close();
    }
  });

  ws.on("close", () => {
    clearTimeout(timeout);

    const player = room.disconnect(ws);
    if (player) log(room.id, `${player.name} disconnected`);
    if (room.clients.length === 0) {
      rooms.delete(room.id);
      log(room.id, "Room deleted");
    }
  });
});

http
  .createServer((req, res) => {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": process.env.SERVER_ALLOWED_ORIGINS,
    };

    if (req.url === "/rooms") {
      res.writeHead(200, headers);

      const publicRooms = Array.from(rooms.values()).filter(
        (room) => room.isPublic
      );

      const data = publicRooms.map<RoomType>((room) => ({
        id: room.id,
        players: room.clients.filter((client) => client.ws).length,
        allowWatchMode: room.allowWatchMode,
        expansions: room.expansions,
        game: room.game && {
          score: room.game.board.score,
          deckSize: room.game.deck.amountOfCards,
          lives: room.game.lives,
          turnNumber: room.game.turnNumber,
          roundNumber: room.game.roundNumber,
          tips: room.game.tips,
          isGamePaused: room.game.isGamePaused,
        },
      }));

      res.end(JSON.stringify(data));
      return;
    }

    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: "Not found" }));
  })
  .listen(3000);

log("WS", "Server is running on port 8080");
log("HTTP", "Server is running on port 3000");
