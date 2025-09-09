type DisconnectButtonProps = {
  onDisconnect: () => void;
};

export const DisconnectButton = ({ onDisconnect }: DisconnectButtonProps) => {
  return (
    <button className="disconnect-button" onClick={onDisconnect}>
      Sair
    </button>
  );
};
