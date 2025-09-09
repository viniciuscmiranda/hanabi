import type { RoomState } from "../../../core/types";

type RoomProps = {
  state: RoomState;
  onReady: () => void;
};

export const Room = ({ state, onReady }: RoomProps) => {
  const me = state.players.find((player) => player.isMe);

  return (
    <main className="room">
      <h1>🎆 花火</h1>
      <section>
        <ul>
          {state.players.map((player) => (
            <li key={player.name}>
              <span>{player.ready ? "✅" : "❌"}</span>
              <span>
                {player.name}
                {player.isMe ? " (eu)" : ""}
              </span>
            </li>
          ))}
        </ul>

        <footer>
          <button onClick={onReady} disabled={me?.ready}>
            Pronto!
          </button>
        </footer>
      </section>
    </main>
  );
};
