type LoadingProps = {
  message: string;
};

export const Loading = ({ message }: LoadingProps) => {
  return (
    <div className="loading">
      <p>{message}...</p>
      <div />
    </div>
  );
};
