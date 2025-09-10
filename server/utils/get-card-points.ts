import { Card } from "../game/card";

const pointsByCardValue: Record<Card.VALUE, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

export function getCardPoints(card: Card) {
  return pointsByCardValue[card.value];
}
