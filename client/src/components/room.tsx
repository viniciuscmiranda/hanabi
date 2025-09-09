import type { RoomState } from "../../../core/types";
import { DisconnectButton } from "./disconnect-button";

type RoomProps = {
  state: RoomState;
  onReady: () => void;
  onDisconnect: () => void;
};

export const Room = ({ state, onReady, onDisconnect }: RoomProps) => {
  const me = state.players.find((player) => player.isMe);

  return (
    <>
      <DisconnectButton onDisconnect={onDisconnect} />

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
    </>
  );
};
