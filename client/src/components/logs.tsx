import { useState } from "react";
import type { Log } from "../../../core/types";

type LogsProps = {
  logs: Log[];
};

export const Logs = ({ logs }: LogsProps) => {
  const [showDetailedHistory, setShowDetailedHistory] = useState(false);

  const filteredLogs = showDetailedHistory
    ? logs
    : logs.filter((log) =>
        log.message.match(
          /jogou|descartou|deu a dica|perdeu uma vida|entrou|saiu|Início|Fim/
        )
      );

  return (
    <>
      <button className="logs-button">Histórico</button>
      <div className="logs">
        <div className="scroll-bar">
          <label>
            <input
              type="checkbox"
              checked={showDetailedHistory}
              onChange={() => setShowDetailedHistory(!showDetailedHistory)}
            />
            Mostrar histórico detalhado
          </label>
          <ul>
            {filteredLogs.map((log, index) => {
              const date = new Date(log.timestamp);
              const time = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              return (
                <li key={index}>
                  <time>{time}</time> - {log.message}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
