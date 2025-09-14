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
