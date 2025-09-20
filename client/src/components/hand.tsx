type HandProps = {
  children: React.ReactNode;
  name: string;
  isCurrent: boolean;
  isMe: boolean;
  isWatchMode: boolean;
};

export const Hand = ({
  children,
  name,
  isCurrent,
  isMe,
  isWatchMode,
}: HandProps) => {
  return (
    <li
      data-current={isCurrent ? "true" : undefined}
      className={`player ${isMe ? "me" : ""} ${
        isCurrent ? "animation-player-current" : ""
      }`}
    >
      {isWatchMode && <span className="watch-mode">Modo espectador</span>}
      <h3>{name}</h3>
      <ul className="hand">{children}</ul>
    </li>
  );
};
