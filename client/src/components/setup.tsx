import { useState } from "react";

type SetupProps = {
  error?: string;
  initialURL?: string;
  onConnect: (url: string) => void;
};

export const Setup = ({ error, onConnect, initialURL }: SetupProps) => {
  const [value, setValue] = useState(initialURL);

  return (
    <form
      className="setup"
      onSubmit={(e) => {
        e.preventDefault();
        if (value) onConnect(value);
      }}
    >
      <header>
        <h1>🎆 花火</h1>
      </header>
      <section>
        {error && <p>{error}</p>}
        <input
          name="url"
          autoFocus
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
