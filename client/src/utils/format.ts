import type { Card } from "../../../core/types/card";

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

const readableByNumberValue: Record<Card.VALUE, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
};

export const Format = {
  card(card: Card) {
    const value = readableByCardValue[card.value];
    const color = readableByCardColor[card.color];

    return `${value}${color}`;
  },
  color(color: Card.COLOR) {
    return readableByCardColor[color];
  },
  value(value: Card.VALUE) {
    return readableByCardValue[value];
  },
  numberValue(value?: Card.VALUE | null) {
    if (!value) return "?";
    return readableByNumberValue[value];
  },
  score(score: number) {
    if (score <= 5) return "Horrível, vaias da multidão...";
    if (score <= 10) return "Medíocre, mal se ouvem aplausos.";
    if (score <= 15) return "Honroso, mas não fica na memória...";
    if (score <= 20) return "✨ Excelente, encanta a multidão.";
    if (score <= 24) return "💫 Extraordinário, ficará na memória!";
    if (score <= 29)
      return "⭐ Lendário, adultos e crianças atônitos, estrelas em seus olhos!";
    return "🌟 Divino, até o céu se agita!";
  },
};
