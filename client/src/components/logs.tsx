import type { Log } from "../../../core/types";

type LogsProps = {
  logs: Log[];
};

export const Logs = ({ logs }: LogsProps) => {
  return (
    <>
      <button className="logs-button">Histórico</button>
      <div className="logs">
        <ul>
          {logs.map((log, index) => {
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
    </>
  );
};
