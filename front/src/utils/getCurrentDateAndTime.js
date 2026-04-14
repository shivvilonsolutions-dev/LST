
const getCurrentDateTime = () => {
  const now = new Date();

  return now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).toUpperCase();
};

export default getCurrentDateTime