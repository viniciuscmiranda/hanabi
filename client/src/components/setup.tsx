import { useState } from "react";

type SetupProps = {
  error?: string;
  initial?: string;
  onConnect: (url: string) => void;
};

export const Setup = ({ error, onConnect, initial }: SetupProps) => {
  const [value, setValue] = useState(initial);

  return (
    <form
      className="setup"
      onSubmit={(e) => {
        e.preventDefault();
        if (value) onConnect(value);
      }}
    >
      <h1>🎆 花火</h1>
      <section>
        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="URL do servidor"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button disabled={!value} type="submit">
          Conectar
        </button>
      </section>
    </form>
  );
};
