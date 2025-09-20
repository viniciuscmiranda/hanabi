import type { Me, OtherPlayer } from "../../../core/types";
import { useEffect, useRef } from "react";
import { Format } from "../utils/format";

type CardType = (Me | OtherPlayer)["hand"][number];

type CardProps = {
  card: CardType;
  disabled: boolean;
  anchorTop?: boolean;
  showTips?: boolean;
  isValueRevealed?: boolean;
  isColorRevealed?: boolean;
  isMe?: boolean;
  deckSize?: number;
  animation?: "play" | "discard" | "give-tip";
  backCard?: CardType;
  drawnCard?: CardType;
  options?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }[];
};

function parsePx(value: string, defaultValue: number = 0) {
  return Number(value.replace("px", "")) || defaultValue;
}

// TODO: refactor
export const Card = ({
  card,
  disabled,
  anchorTop,
  showTips,
  options,
  animation,
  deckSize = 0,
  backCard,
  drawnCard,
  isMe,
}: CardProps) => {
  const cardContainerRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const portal = document.getElementById("root");
    if (!portal) return;

    const lastCloneEl = document.getElementById("card-clone");
    const lastDrawEl = document.getElementById("card-draw");
    if (lastCloneEl && portal.contains(lastCloneEl))
      portal.removeChild(lastCloneEl);
    if (lastDrawEl && portal.contains(lastDrawEl))
      portal.removeChild(lastDrawEl);

    if (!cardContainerRef.current || !animation) return;

    if (animation === "give-tip") {
      // TODO: add give tip animation
      return;
    }

    const cardContainerRt = cardContainerRef.current.getBoundingClientRect();

    if (animation === "discard") {
      const discardPile = document.getElementById("discard-pile");
      if (!discardPile) return;

      const discardPileRt = discardPile.getBoundingClientRect();

      const discardedCardEl = cardContainerRef.current.cloneNode(
        true
      ) as HTMLButtonElement;

      const discardPilePadding = parsePx(
        getComputedStyle(discardPile).paddingBottom
      );

      const discardX = Math.round(
        discardPileRt.x -
          cardContainerRt.x +
          discardPileRt.width / 2 -
          cardContainerRt.width / 2
      );

      const discardY = Math.round(
        discardPileRt.y -
          cardContainerRt.y +
          discardPileRt.height -
          cardContainerRt.height -
          discardPilePadding
      );

      discardedCardEl.id = "card-clone";
      discardedCardEl.classList.add("animation-discard");
      discardedCardEl.classList.add("card-container-clone");
      discardedCardEl.classList.remove("card-container-animating");
      discardedCardEl.style.setProperty("--start-x", `${cardContainerRt.x}px`);
      discardedCardEl.style.setProperty("--start-y", `${cardContainerRt.y}px`);
      discardedCardEl.style.setProperty("--target-x", `${discardX}px`);
      discardedCardEl.style.setProperty("--target-y", `${discardY}px`);
      portal.appendChild(discardedCardEl);
    }

    if (animation === "play") {
      const boardEl = document.getElementById("board");
      if (!boardEl) return;

      const pileEl = boardEl.querySelector(
        `.card[data-color="${backCard?.color}"]`
      );
      const boardSlotEl = document.getElementById("board-play-slot");

      const playedCardEl = cardContainerRef.current.cloneNode(
        true
      ) as HTMLButtonElement;

      let playX = 0;
      let playY = 0;

      if (pileEl) {
        const pileRt = pileEl.getBoundingClientRect();
        playY = Math.round(pileRt.y - cardContainerRt.y);
        playX = Math.round(pileRt.x - cardContainerRt.x);
      } else if (boardSlotEl) {
        const boardSlotRt = boardSlotEl.getBoundingClientRect();

        console.log(boardSlotEl);
        console.log(boardSlotRt);
        playY = Math.round(boardSlotRt.y - cardContainerRt.y);
        playX = Math.round(
          boardSlotRt.x - cardContainerRt.x - cardContainerRt.width / 2 + 4
        );

        boardSlotEl.classList.add("board-play-slot-animation");
      }

      playedCardEl.id = "card-clone";
      playedCardEl.classList.add("animation-play");
      playedCardEl.classList.add("card-container-clone");
      playedCardEl.classList.remove("card-container-animating");
      playedCardEl.style.setProperty("--start-x", `${cardContainerRt.x}px`);
      playedCardEl.style.setProperty("--start-y", `${cardContainerRt.y}px`);
      playedCardEl.style.setProperty("--target-x", `${playX}px`);
      playedCardEl.style.setProperty("--target-y", `${playY}px`);
      portal.appendChild(playedCardEl);
    }

    // draw animation
    const deckPileEl = document.getElementById("deck");
    const handEl = cardContainerRef.current.closest(".hand");
    const drawSlotEl = handEl?.querySelector(".card-draw-slot");

    if (!deckPileEl || !drawSlotEl || deckSize <= 0) return;

    const deckPileRt = deckPileEl.getBoundingClientRect();
    const drawSlotRt = drawSlotEl.getBoundingClientRect();
    const drawnCardEl = cardContainerRef.current.cloneNode(
      true
    ) as HTMLButtonElement;

    const cardEl = drawnCardEl.querySelector<HTMLButtonElement>(".card");

    if (cardEl) {
      const vars = window.getComputedStyle(document.documentElement);

      cardEl.innerHTML = Format.numberValue(drawnCard?.value);
      cardEl.dataset.color = drawnCard?.color || "";
      cardEl.dataset.value = drawnCard?.value || "";
      const colorStyle = vars.getPropertyValue(
        `--color-card-${drawnCard?.color}`
      );

      if (colorStyle) cardEl.style.setProperty("--color", colorStyle);
    }

    const drawY = Math.round(drawSlotRt.y - deckPileRt.y);
    const drawX = Math.round(
      drawSlotRt.x - deckPileRt.x - cardContainerRt.width
    );

    drawnCardEl.id = "card-draw";
    drawnCardEl.classList.add("animation-draw");
    drawnCardEl.classList.add("card-container-clone");
    drawnCardEl.classList.remove("card-container-animating");
    drawnCardEl.classList.remove("card-container-flip");
    drawnCardEl.style.setProperty("--start-x", `${deckPileRt.x}px`);
    drawnCardEl.style.setProperty("--start-y", `${deckPileRt.y}px`);
    drawnCardEl.style.setProperty("--target-x", `${drawX}px`);
    drawnCardEl.style.setProperty("--target-y", `${drawY}px`);
    portal.appendChild(drawnCardEl);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation]);

  return (
    <li
      ref={cardContainerRef}
      className={(() => {
        const classes = [];
        if (animation && animation !== "give-tip") {
          classes.push("card-container-animating");
          if (deckSize > 0) classes.push("card-can-draw");
          if (isMe && (!card.isValueRevealed || !card.isColorRevealed)) {
            classes.push("card-container-flip");
          }
        }

        return `card-container ${classes.join(" ")}`;
      })()}
    >
      <div className="card-container-inner">
        <button
          className="card"
          data-color={card.color}
          data-value={card.value}
          disabled={disabled}
        >
          {Format.numberValue(card.value)}
          {showTips && (
            <span className="tip">
              {card.isColorRevealed && card.color && (
                <span>{Format.color(card.color)}</span>
              )}
              {card.isValueRevealed && card.value && (
                <span>{Format.value(card.value)}</span>
              )}
            </span>
          )}
        </button>

        <div
          className="card-back"
          data-color={backCard?.color}
          data-value={backCard?.value}
        >
          {Format.numberValue(backCard?.value)}
        </div>
      </div>

      {options && options.length > 0 && !disabled && (
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
