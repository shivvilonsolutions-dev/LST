import {
  useState,
  useEffect,
} from "react";

import {
  QuotationContext,
} from "./quotationContext";

import {
  getQuotations,
  createQuotation,
  updateQuotation,
  deleteQuotation,
} from "../../api/quotationApi";

import useLoading
  from "../../hooks/useLoading";

import useApiError
  from "../../hooks/useApiError";

const QuotationProvider = ({
  children,
}) => {

  const [
    quotations,
    setQuotations,
  ] = useState([]);

  const {
    loading,
    startLoading,
    stopLoading,
  } = useLoading();

  const {
    error,
    setError,
    clearError,
  } = useApiError();

  // FETCH
  const fetchQuotations =
    async () => {

      try {

        startLoading();

        clearError();

        const response =
          await getQuotations();

        setQuotations(
          response.data || []
        );

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to fetch quotations"
        );

      } finally {

        stopLoading();
      }
    };

  // CREATE
  const handleCreateQuotation =
    async (data) => {

      try {

        clearError();

        const response =
          await createQuotation(
            data
          );

        setQuotations((prev) => [
          response.data,
          ...prev,
        ]);

        return {
          success: true,
          data: response.data,
        };

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to create quotation"
        );

        return {
          success: false,
        };
      }
    };

  // UPDATE
  const handleUpdateQuotation =
    async (
      quotationNo,
      data
    ) => {

      try {

        clearError();

        const response =
          await updateQuotation(
            quotationNo,
            data
          );

        setQuotations((prev) =>
          prev.map((q) =>
            q.quotationNo ===
              quotationNo
              ? response.data
              : q
          )
        );

        return {
          success: true,
        };

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to update quotation"
        );

        return {
          success: false,
        };
      }
    };

  // DELETE
  const handleDeleteQuotation =
    async (quotationNo) => {

      try {

        clearError();

        await deleteQuotation(
          quotationNo
        );

        setQuotations((prev) =>
          prev.filter(
            (q) =>
              q.quotationNo !==
              quotationNo
          )
        );

        return {
          success: true,
        };

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to delete quotation"
        );

        return {

          success: false,

          message:
            err.response?.data?.message ||

            err.message ||

            "Failed to create quotation",
        };
      }
    };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <QuotationContext.Provider
      value={{
        quotations,

        loading,
        error,

        fetchQuotations,

        handleCreateQuotation,
        handleUpdateQuotation,
        handleDeleteQuotation,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
};

export default QuotationProvider;