type HandProps = {
  children: React.ReactNode;
  name: string;
  isCurrent: boolean;
  isConnected: boolean;
  isMe: boolean;
  isLeader: boolean;
  isWatchMode: boolean;
  canKick: boolean;
  onKick: () => void;
};

export const Hand = ({
  children,
  name,
  isCurrent,
  isConnected,
  isMe,
  isLeader,
  isWatchMode,
  canKick,
  onKick,
}: HandProps) => {
  return (
    <li
      data-current={isCurrent ? "true" : undefined}
      className={`player ${isMe ? "me" : ""} ${
        isCurrent ? "animation-player-current" : ""
      }`}
    >
      {isWatchMode && <span className="watch-mode">Modo espectador</span>}
      <h3>
        {name}
        {isLeader && " 👑"}
        {!isConnected && " 📵"}
        {canKick && (
          <button className="kick-button" onClick={onKick}>
            🚫
          </button>
        )}
      </h3>
      <ul className="hand">{children}</ul>
    </li>
  );
};
