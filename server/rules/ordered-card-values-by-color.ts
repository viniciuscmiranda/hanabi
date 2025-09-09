import { Card } from "../game/card";

export const ORDERED_CARD_VALUES_BY_COLOR: Record<Card.COLOR, Card.VALUE[]> = {
  red: ["one", "two", "three", "four", "five"],
  green: ["one", "two", "three", "four", "five"],
  blue: ["one", "two", "three", "four", "five"],
  yellow: ["one", "two", "three", "four", "five"],
  white: ["one", "two", "three", "four", "five"],
  multicolor: ["one", "two", "three", "four", "five"],
  colorless: ["five", "four", "three", "two", "one"],
};
