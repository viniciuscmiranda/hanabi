import type { GameState } from "../../../core/types";
import { Card } from "./card";

type GameOverProps = {
  state: GameState;
  onReset: () => void;
};

export const GameOver = ({ state, onReset }: GameOverProps) => {
  return (
    <div className="game-over">
      <h2>Fim de Jogo</h2>
      <p>Pontuação: {state.score}</p>

      <ul>
        {state.board.map((pile, index) => (
          <Card key={index} card={pile[0]} disabled />
        ))}
      </ul>

      <button onClick={onReset}>Reiniciar</button>
    </div>
  );
};
