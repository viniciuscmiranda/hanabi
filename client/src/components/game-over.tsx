import type { GameState } from "../../../core/types";
import { Card } from "./card";

type GameOverProps = {
  state: GameState;
  onReset: () => void;
};

export const GameOver = ({ state, onReset }: GameOverProps) => {
  function getScoreQuality() {
    if (state.score <= 5) return "Horrível, vaias da multidão...";
    if (state.score <= 10) return "Medíocre, mal se ouvem aplausos.";
    if (state.score <= 15) return "Honroso, mas não fica na memória...";
    if (state.score <= 20) return "✨ Excelente, encanta a multidão.";
    if (state.score <= 24) return "💫 Extraordinário, ficará na memória!";
    if (state.score <= 29)
      return "⭐ Lendário, adultos e crianças atônitos, estrelas em seus olhos!";
    return "🌟 Divino, até o céu se agita!";
  }

  return (
    <div className="game-over">
      <h2>Fim de Jogo</h2>
      <p>Pontuação: {state.score}</p>
      <p>{getScoreQuality()}</p>

      <ul>
        {state.board.map((pile, index) => (
          <Card key={index} card={pile[0]} disabled />
        ))}
      </ul>

      <button onClick={onReset}>Reiniciar</button>
    </div>
  );
};
