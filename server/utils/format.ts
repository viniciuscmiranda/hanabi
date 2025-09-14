import { Card } from "../game/card";

const readableByCardValue: Record<Card.VALUE, string> = {
  one: "1️⃣",
  two: "2️⃣",
  three: "3️⃣",
  four: "4️⃣",
  five: "5️⃣",
};

const readableByCardColor: Record<Card.COLOR, string> = {
  red: "🔴",
  green: "🟢",
  blue: "🔵",
  yellow: "🟡",
  white: "⚪",
  multicolor: "🌈",
  colorless: "⚫",
};

export const Format = {
  card(card: Card) {
    const value = readableByCardValue[card.value];
    const color = readableByCardColor[card.color];

    return `${value}${color}`;
  },
  info(info: Card.INFO, card: Card) {
    if (info === "value") return readableByCardValue[card.value];
    else if (info === "color") return readableByCardColor[card.color];
  },
};
