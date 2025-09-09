type HandProps = {
  children: React.ReactNode;
  name: string;
  isCurrent: boolean;
  isMe: boolean;
};

export const Hand = ({ children, name, isCurrent, isMe }: HandProps) => {
  return (
    <li
      className={`player ${isMe ? "me" : ""}`}
      data-current={isCurrent ? "true" : undefined}
    >
      <h3>{name}</h3>
      <ul className="hand">{children}</ul>
    </li>
  );
};
