import {
  useState,
  useEffect,
} from "react";

import {
  InventoryContext,
} from "./inventoryContext";

import {
  getInventories,
  upsertInventory,
  deleteInventory,
} from "../../api/inventoryApi";

import useLoading
from "../../hooks/useLoading";

import useApiError
from "../../hooks/useApiError";

const InventoryProvider = ({
  children,
}) => {

  const [
    inventories,
    setInventories,
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
  const fetchInventories =
    async () => {

      try {

        startLoading();

        clearError();

        const response =
          await getInventories();

        setInventories(
          response.data || []
        );

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to fetch inventories"
        );

      } finally {

        stopLoading();
      }
    };

  // UPSERT
  const handleUpsertInventory =
    async (data) => {

      try {

        clearError();

        const response =
          await upsertInventory(
            data
          );

        const updatedInventory =
          response.data;

        setInventories((prev) => {

          const exists =
            prev.some(
              (inv) =>
                inv.inventoryId ===
                updatedInventory.inventoryId
            );

          if (exists) {

            return prev.map(
              (inv) =>
                inv.inventoryId ===
                updatedInventory.inventoryId
                  ? updatedInventory
                  : inv
            );
          }

          return [
            updatedInventory,
            ...prev,
          ];
        });

        return {
          success: true,
        };

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to save inventory"
        );

        return {
          success: false,
        };
      }
    };

  // DELETE
  const handleDeleteInventory =
    async (inventoryId) => {

      try {

        clearError();

        await deleteInventory(
          inventoryId
        );

        setInventories((prev) =>
          prev.filter(
            (inv) =>
              inv.inventoryId !==
              inventoryId
          )
        );

        return {
          success: true,
        };

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to delete inventory"
        );

        return {
          success: false,
        };
      }
    };

  useEffect(() => {
    fetchInventories();
  }, []);

  return (

    <InventoryContext.Provider
      value={{
        inventories,

        loading,
        error,

        fetchInventories,

        handleUpsertInventory,
        handleDeleteInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryProvider;