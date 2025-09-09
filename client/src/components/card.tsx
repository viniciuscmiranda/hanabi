import type { Card as CardType, Me, OtherPlayer } from "../../../core/types";

type CardProps = {
  card: (Me | OtherPlayer)["hand"][number];
  disabled: boolean;
  anchorTop?: boolean;
  onClick?: () => void;
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

export const Card = ({
  card,
  disabled,
  anchorTop,
  onClick,
  options,
}: CardProps) => {
  return (
    <li>
      <button
        className="card"
        data-color={card.color}
        data-value={card.value}
        disabled={disabled}
        onClick={onClick}
      >
        {card.value ? valueMap[card.value] : "?"}
      </button>

      {options && options.length > 0 && (
        <ul
          className="options"
          data-anchor-top={anchorTop ? "true" : undefined}
        >
          {options?.map((option) => (
            <li key={option.label}>
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
