import type { Reaction } from "../../../core/types";

const EMOJIS = ["😡", "😭", "😅", "😂", "🥳", "🤔"];

type ReactionsProps = {
  onReact: (reaction: string) => void;
  reactions: Reaction[];
};

// TODO: change first react every 5 seconds
export const Reactions = ({ reactions, onReact }: ReactionsProps) => {
  return (
    <div className="reactions">
      <ul>
        {EMOJIS.map((reaction, index) => (
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
