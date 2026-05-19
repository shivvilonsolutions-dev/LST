import { useState } from "react";

const useApiError = () => {

  const [error, setError] =
    useState("");

  const clearError = () => {
    setError("");
  };

  return {
    error,
    setError,
    clearError,
  };
};

export default useApiError;