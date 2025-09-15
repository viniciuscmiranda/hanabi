import { useEffect, useState } from "react";

import type { Reaction } from "../../../core/types";

const EMOJIS = ["😅", "😭", "😂", "🥳", "🤔", "😡"];
const CHANGE_INTERVAL = 5000;

type ReactionsProps = {
  onReact: (reaction: string) => void;
  reactions: Reaction[];
};

export const Reactions = ({ reactions, onReact }: ReactionsProps) => {
  const [emojis, setEmojis] = useState(EMOJIS);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojis([...EMOJIS].sort(() => Math.random() - 0.5));
    }, CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="reactions">
      <ul>
        {emojis.map((reaction, index) => (
          <li key={reaction} data-index={index}>
            <button onClick={() => onReact(reaction)}>{reaction}</button>
          </li>
        ))}
      </ul>

      <div className="active-reactions">
        {reactions.map((reaction) => (
          <span data-position={reaction.position} key={reaction.key}>
            {reaction.emoji}
          </span>
        ))}
      </div>
    </div>
  );
};
