import { useState } from "react";

import { Card } from "./card";
import { Format } from "../utils/format";

import type { GameState } from "../../../core/types";

type GameOverProps = {
  state: GameState;
  onReset: () => void;
};

export const GameOver = ({ state, onReset }: GameOverProps) => {
  const [isCopied, setIsCopied] = useState(false);

  function onShare() {
    const text = `🎆 花火 - Hanabi

🏆 ${state.score} pontos
${Format.score(state.score)}

${state.board.map((pile) => `${Format.card(pile[0])}`).join("\n")}

${window.location.origin}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <div className="game-over">
      <h2>Fim de Jogo</h2>
      <p>Pontuação: {state.score}</p>
      <p>{Format.score(state.score)}</p>

      <ul>
        {state.board.map((pile, index) => (
          <Card key={index} card={pile[0]} disabled />
        ))}
      </ul>
      <footer>
        <button onClick={onReset}>Voltar para a sala</button>
      </footer>

      <button onClick={onShare} disabled={isCopied}>
        {isCopied ? "Copiado!" : "Compartilhar"}
      </button>
    </div>
  );
};
