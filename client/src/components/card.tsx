import type { Card as CardType, Me, OtherPlayer } from "../../../core/types";

type CardProps = {
  card: (Me | OtherPlayer)["hand"][number];
  disabled: boolean;
  anchorTop?: boolean;
  showTips?: boolean;
  isValueRevealed?: boolean;
  isColorRevealed?: boolean;
  options?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }[];
};

const valueMap: Record<CardType.VALUE, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
};

const colorEmojiMap: Record<CardType.COLOR, string> = {
  red: "🔴",
  green: "🟢",
  blue: "🔵",
  yellow: "🟡",
  white: "⚪",
  multicolor: "🌈",
  colorless: "⚫",
};

const valueEmojiMap: Record<CardType.VALUE, string> = {
  one: "1️⃣",
  two: "2️⃣",
  three: "3️⃣",
  four: "4️⃣",
  five: "5️⃣",
};

export const Card = ({
  card,
  disabled,
  anchorTop,
  showTips,
  options,
}: CardProps) => {
  return (
    <li>
      <button
        className="card"
        data-color={card.color}
        data-value={card.value}
        disabled={disabled}
      >
        {card.value ? valueMap[card.value] : "?"}
        {showTips && (
          <span className="tip">
            {card.isColorRevealed && card.color && (
              <span>{colorEmojiMap[card.color]}</span>
            )}
            {card.isValueRevealed && card.value && (
              <span>{valueEmojiMap[card.value]}</span>
            )}
          </span>
        )}
      </button>

      {options && options.length > 0 && (
        <ul
          className="options"
          data-anchor-top={anchorTop ? "true" : undefined}
        >
          {options?.map((option, index) => (
            <li key={index}>
              <button onClick={option.onClick} disabled={option.disabled}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
