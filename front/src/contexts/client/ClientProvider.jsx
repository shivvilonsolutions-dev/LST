import {
  useState,
  useEffect,
} from "react";

import { ClientContext }
from "./clientContext";

import {
  getClients,
  updateClient,
} from "../../api/clientApi";

import useLoading
from "../../hooks/useLoading";

import useApiError
from "../../hooks/useApiError";

const ClientProvider = ({
  children,
}) => {

  const [clients, setClients] =
    useState(() => {
    // Load from localStorage for instant rendering
    try {
      const cached = localStorage.getItem('lst_clients');
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

  // FETCH CLIENTS
  const fetchClients =
    async () => {

      try {
        // Don't show loading if we have cached data
        if (clients.length === 0) {
          startLoading();
        }

        clearError();

        const response =
          await getClients();

        setClients(response.data || []);
        
        // Cache in localStorage
        localStorage.setItem('lst_clients', JSON.stringify(response.data || []));

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to fetch clients"
        );

      } finally {

        stopLoading();
      }
    };

  // UPDATE CLIENT
  const handleUpdateClient =
    async (id, data) => {

      try {

        clearError();

        const response =
          await updateClient(
            id,
            data
          );

        setClients((prev) =>
          prev.map((client) =>
            client.cliId === id
              ? response.data
              : client
          )
        );

        // Update cache
        localStorage.setItem('lst_clients', JSON.stringify(
          clients.map((client) =>
            client.cliId === id
              ? response.data
              : client
          )
        ));

        return {
          success: true,
        };

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to update client"
        );

        return {
          success: false,
        };
      }
    };

  useEffect(() => {
    // Instant load from cache, then fetch fresh data
    if (clients.length === 0) {
      fetchClients();
    } else {
      // Background refresh without loading state
      fetchClients();
    }
  }, []);

  return (
    <ClientContext.Provider
      value={{
        clients,
        setClients,

        loading: false, // Never show loading state for cached data
        error,

        fetchClients,
        handleUpdateClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;