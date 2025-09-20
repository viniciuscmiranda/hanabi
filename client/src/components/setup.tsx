import { useEffect, useState } from "react";

import type { Room } from "../../../core/types";

type SetupProps = {
  error?: string;
  initialServerURL?: string;
  onConnect: (url: string) => void;
};

const HTTP_SERVER_URL =
  import.meta.env.VITE_HTTP_SERVER_URL || "http://localhost:3000";
const WS_SERVER_URL =
  import.meta.env.VITE_WS_SERVER_URL || "ws://localhost:8080";

export const Setup = ({ error, onConnect, initialServerURL }: SetupProps) => {
  const serverURL = initialServerURL || WS_SERVER_URL;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchRooms() {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    fetch(`${HTTP_SERVER_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="setup">
      <header>
        <h1>🎆 花火</h1>
      </header>

      <section>
        <div className="rooms">
          <header>
            <h3>Salas</h3>
            <button
              title="Atualizar salas"
              type="button"
              onClick={fetchRooms}
              disabled={isLoading}
            >
              {isLoading ? <div className="loading-button" /> : "🔄"}
            </button>
          </header>

          {!rooms.length && (
            <i className="rooms-empty">Nenhuma sala encontrada</i>
          )}

          <ul className="scroll-bar">
            {rooms.map((room) => {
              const url = new URL(window.location.href);
              const server = new URL(serverURL);

              return (
                <li key={room.id}>
                  <a href={`${url.href}?server=${server.origin}/${room.id}`}>
                    <span>
                      {room.id}{" "}
                      {room.game &&
                        (room.game.isGamePaused ? (
                          <span title="Jogo pausado">⏸️</span>
                        ) : (
                          <span title="Jogo em andamento">▶️</span>
                        ))}
                    </span>

                    <div className="room-info">
                      {room.expansions.includes("avalanche_of_colors") && (
                        <span title="Expansão: Avalanche de Cores">🌈</span>
                      )}
                      {room.expansions.includes("black_powder") && (
                        <span title="Expansão: Pólvora Negra">⚫</span>
                      )}
                      {room.allowWatchMode && (
                        <span title="Permiti espectadores">👀</span>
                      )}
                      <span title="Jogadores">{room.players}/5</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <button onClick={() => onConnect(new URL(serverURL).origin)}>
          Criar sala
        </button>
        {error && <p className="error">{error}</p>}
      </section>
    </div>
  );
};
