import { WebSocketServer, type WebSocket } from "ws";

import { Room } from "./game/room";
import type { GameEvent, PlayerEvent } from "../core/types";

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

function formatError(error: Error) {
  const message: GameEvent = {
    event: "ERROR",
    payload: { error: error.message },
  };

  return JSON.stringify(message);
}

// TODO: add unit tests
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
    ws.send(formatError(error));
    ws.close();
    return;
  }

  ws.on("message", (raw) => {
    const data = (JSON.parse(raw.toString()) || {}) as PlayerEvent;

    try {
      room.handlePlayerEvent(ws, data);
    } catch (error) {
      ws.send(formatError(error));
      ws.close();
    }
  });

  ws.on("close", () => {
    const player = room.disconnect(ws);
    if (player) log(room.id, `${player.name} disconnected`);
    if (room.clients.length === 0) {
      rooms.delete(room.id);
      log(room.id, "Room deleted");
    }
  });
});

log("server", "Server is running on port 8080");
