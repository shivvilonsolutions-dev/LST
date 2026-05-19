const ErrorMessage = ({
  message,
}) => {

  if (!message) return null;

  return (
    <div
      className="
        bg-red-100
        text-red-700
        px-4
        py-2
        rounded-md
        text-sm
        mb-3
      "
    >
      {message}
    </div>
  );
};

export default ErrorMessage;