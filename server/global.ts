import type { WebSocket } from "ws";

import { Game } from "./game/game";
import { Player } from "./game/player";
import type { Expansion } from "../core/types";

export const Global = {
  clients: [] as { ws: WebSocket | null; player: Player }[],
  expansions: [] as Expansion[],
  game: null as Game | null,
};
