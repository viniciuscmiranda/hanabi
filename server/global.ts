import type { WebSocket } from "ws";

import { Game } from "./game/game";
import { Player } from "./game/player";

export const Global = {
  clients: [] as { ws: WebSocket; player: Player }[],
  game: null as Game | null,
};
