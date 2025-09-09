import type { Card as CardType } from "../../core/types/card";

class Card {
  public isValueRevealed = false;
  public isColorRevealed = false;

  constructor(public value: Card.VALUE, public color: Card.COLOR) {}

  public reveal(info: Card.INFO) {
    if (info === "value") this.isValueRevealed = true;
    else if (info === "color") this.isColorRevealed = true;
  }
}

namespace Card {
  export type VALUE = CardType.VALUE;
  export type COLOR = CardType.COLOR;
  export type INFO = CardType.INFO;
}

export { Card };
