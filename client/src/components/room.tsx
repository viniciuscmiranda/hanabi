import type { Expansion, RoomState } from "../../../core/types";
import { DisconnectButton } from "./disconnect-button";

type RoomProps = {
  state: RoomState;
  onReady: () => void;
  onRename: () => void;
  onDisconnect: () => void;
  onSetExpansions: (expansions: Expansion[]) => void;
};

export const Room = ({
  state,
  onReady,
  onRename,
  onDisconnect,
  onSetExpansions,
}: RoomProps) => {
  const me = state.players.find((player) => player.isMe);

  function toggleExpansion(expansion: Expansion) {
    if (state.expansions.includes(expansion)) {
      onSetExpansions(state.expansions.filter((e) => e !== expansion));
    } else {
      onSetExpansions([...state.expansions, expansion]);
    }
  }

  return (
    <>
      <DisconnectButton onDisconnect={onDisconnect} />

      <main className="room">
        <h1>🎆 花火</h1>

        <section>
          <div className="expansions">
            <h4>Expansões</h4>
            <div>
              <button onClick={() => toggleExpansion("avalanche_of_colors")}>
                <span>
                  {state.expansions.includes("avalanche_of_colors")
                    ? "✅"
                    : "❌"}
                </span>
                <span>Avalanche de Cores</span>
              </button>
              <button onClick={() => toggleExpansion("black_powder")}>
                <span>
                  {state.expansions.includes("black_powder") ? "✅" : "❌"}
                </span>
                <span>Pólvora Negra</span>
              </button>
            </div>
          </div>

          <h4>Jogadores</h4>
          <ul>
            {state.players.map((player, index) => (
              <li key={index}>
                <div className="player-name">
                  <span>{player.ready ? "✅" : "❌"}</span>
                  <span>
                    {player.name}
                    {player.isMe && " (eu)"}
                  </span>
                </div>
                {player.isMe && (
                  <button
                    onClick={onRename}
                    className="rename-button"
                    title="Renomear"
                  >
                    🔃
                  </button>
                )}
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
