import { useState } from "react";

import type { Expansion, RoomSettings, RoomState } from "../../../core/types";

type RoomProps = {
  state: RoomState;
  onReady: () => void;
  onRename: () => void;
  onSetRoomSettings: (settings: Partial<RoomSettings>) => void;
  onSetWatchMode: (isWatchMode: boolean) => void;
  onSetLeader: (playerIndex: number) => void;
  onKickPlayer: (playerIndex: number) => void;
};

export const Room = ({
  state,
  onReady,
  onRename,
  onSetRoomSettings,
  onSetWatchMode,
  onSetLeader,
  onKickPlayer,
}: RoomProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const me = state.players.find((player) => player.isMe);

  function toggleExpansion(expansion: Expansion) {
    if (state.settings.expansions.includes(expansion)) {
      onSetRoomSettings({
        expansions: state.settings.expansions.filter((e) => e !== expansion),
      });
    } else {
      onSetRoomSettings({
        expansions: [...state.settings.expansions, expansion],
      });
    }
  }

  return (
    <main className="room">
      <header>
        <h1>🎆 花火</h1>
      </header>

      <section>
        <div className="settings">
          <h4>Configurações</h4>
          <div>
            <button
              disabled={!me?.isLeader}
              onClick={() =>
                onSetRoomSettings({ isPublic: !state.settings.isPublic })
              }
            >
              {state.settings.isPublic ? "✅" : "❌"}
              <span>Sala pública</span>
            </button>
            <button
              disabled={!me?.isLeader}
              onClick={() =>
                onSetRoomSettings({
                  allowWatchMode: !state.settings.allowWatchMode,
                })
              }
            >
              {state.settings.allowWatchMode ? "✅" : "❌"}
              <span>Permitir espectadores</span>
            </button>
          </div>
        </div>

        <div className="expansions">
          <h4>Expansões</h4>
          <div>
            <button
              disabled={!me?.isLeader}
              onClick={() => toggleExpansion("avalanche_of_colors")}
            >
              <span>
                {state.settings.expansions.includes("avalanche_of_colors")
                  ? "✅"
                  : "❌"}
              </span>
              <span>Avalanche de Cores</span>
            </button>
            <button
              disabled={!me?.isLeader}
              onClick={() => toggleExpansion("black_powder")}
            >
              <span>
                {state.settings.expansions.includes("black_powder")
                  ? "✅"
                  : "❌"}
              </span>
              <span>Pólvora Negra</span>
            </button>
          </div>
        </div>

        <div>
          <h4>Jogadores</h4>
          <ul>
            {state.players.map((player, index) => (
              <li key={index}>
                <div className="player-name">
                  {player.isWatching ? (
                    <span>👀</span>
                  ) : (
                    <span>{player.ready ? "✅" : "❌"}</span>
                  )}
                  <span>
                    {player.name}
                    {player.isMe && " (eu)"}
                  </span>

                  {player.isLeader && <span>👑</span>}
                </div>
                {player.isMe && (
                  <div className="player-actions">
                    {state.settings.allowWatchMode && (
                      <button
                        onClick={() => onSetWatchMode(!player.isWatching)}
                        title="Modo espectador"
                      >
                        {player.isWatching ? "🃏" : "👀"}
                      </button>
                    )}
                    <button onClick={onRename} title="Renomear">
                      🎲
                    </button>
                  </div>
                )}
                {me?.isLeader && !player.isMe && (
                  <div className="player-actions">
                    <button
                      onClick={() => onSetLeader(index)}
                      title="Tornar líder"
                    >
                      👑
                    </button>
                    <button
                      onClick={() => onKickPlayer(index)}
                      title="Expulsar"
                    >
                      🚫
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <footer>
          <button onClick={onReady} disabled={me?.ready || me?.isWatching}>
            Pronto!
          </button>

          <button
            className="share-button"
            disabled={isCopied}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 2000);
            }}
          >
            {isCopied ? "Copiado!" : "Convidar"}
          </button>
        </footer>
      </section>
    </main>
  );
};
