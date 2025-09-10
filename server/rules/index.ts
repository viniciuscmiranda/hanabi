import type { Expansion } from "../../core/types";

import { ORDERED_CARD_VALUES_BY_COLOR } from "./ordered-card-values-by-color";
import { CARDS_BY_AMOUNT_OF_PLAYERS } from "./cards-by-amount-of-players";

export const Rules = {
  ORDERED_CARD_VALUES_BY_COLOR,
  CARDS_BY_AMOUNT_OF_PLAYERS,
  MAX_LIVES: 3,
  MAX_TIPS: 8,
  MAX_PLAYERS: 5,
  MIN_PLAYERS: 2,
  EXPANSIONS: ["avalanche_of_colors", "black_powder"] as Expansion[],
};
