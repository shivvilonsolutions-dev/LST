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
  ] = useState(() => {
    // Load from localStorage for instant rendering
    try {
      const cached = localStorage.getItem('lst_quotations');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

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
        // Don't show loading if we have cached data
        if (quotations.length === 0) {
          startLoading();
        }

        clearError();

        const response =
          await getQuotations();

        setQuotations(response.data || []);
        
        // Cache in localStorage
        localStorage.setItem('lst_quotations', JSON.stringify(response.data || []));

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

        const createdItem = response.data?.data || response.data;
        const newQuotations = [createdItem, ...quotations];
        setQuotations(newQuotations);
        
        // Update cache
        localStorage.setItem('lst_quotations', JSON.stringify(newQuotations));

        // Immediately refresh from server to ensure latest data
        await fetchQuotations();

        return {
          success: true,
          data: createdItem,
          quotation: createdItem,
        };

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to create quotation"
        );

        return {
          success: false,
          message: err.response?.data?.message || err.message || "Failed to create quotation",
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

                const updatedItem = response.data?.data || response.data;
        const newQuotations = (quotations || []).map((q) =>
            q && String(q.quotationNo) === String(quotationNo)
              ? updatedItem
              : q
          );
        setQuotations(newQuotations);
        
        // Update cache
        localStorage.setItem('lst_quotations', JSON.stringify(newQuotations));

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

        const newQuotations = (quotations || []).filter(
          (q) =>
            q && q.quotationNo !== quotationNo
        );
        setQuotations(newQuotations);
        
        // Update cache
        localStorage.setItem('lst_quotations', JSON.stringify(newQuotations));

        return {
          success: true,
        };

      } catch (err) {

        const errorMessage =

          err.response?.data?.message ||

          "Failed to create quotation";


        // ONLY FOR REAL SERVER ERRORS
        if (

          !errorMessage.includes(
            "Mobile number already belongs"
          )
        ) {

          setError(
            errorMessage
          );
        }

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
    // Always fetch fresh data on mount to ensure sync
    fetchQuotations();
  }, []);

  return (
    <QuotationContext.Provider
      value={{
        quotations,

        loading: false, // Never show loading state for cached data
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