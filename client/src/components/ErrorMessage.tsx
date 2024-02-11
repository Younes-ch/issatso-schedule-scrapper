interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="text-center font-medium">
      <p className="text-red-600">⛔ {message}</p>
      <p className="text-red-400">
        Please try again later or contact the owner if the problem persists.
      </p>
    </div>
  );
};

export default ErrorMessage;
