import type { Reaction } from "../../../core/types";

const EMOJIS = ["😅", "😭", "😂", "🥳", "🤔", "😡"].sort(
  () => Math.random() - 0.5
);

type ReactionsProps = {
  onReact: (reaction: string) => void;
  reactions: Reaction[];
};

export const Reactions = ({ reactions, onReact }: ReactionsProps) => {
  return (
    <div className="reactions">
      <ul>
        {EMOJIS.map((emoji, index) => (
          <li key={emoji} data-index={index}>
            <button onClick={() => onReact(emoji)}>{emoji}</button>
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
