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
    useState([]);

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

        startLoading();

        clearError();

        const response =
          await getClients();

        setClients(
          response.data || []
        );

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
    fetchClients();
  }, []);

  return (
    <ClientContext.Provider
      value={{
        clients,
        setClients,

        loading,
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