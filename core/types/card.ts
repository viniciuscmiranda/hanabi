type Card = {
  value: Card.VALUE;
  color: Card.COLOR;
  isValueRevealed: boolean;
  isColorRevealed: boolean;
};

namespace Card {
  export type VALUE = "one" | "two" | "three" | "four" | "five";
  export type INFO = "value" | "color";
  export type COLOR =
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "white"
    | "multicolor"
    | "colorless";
}

export type { Card };
