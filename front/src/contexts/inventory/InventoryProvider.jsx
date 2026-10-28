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
  ] = useState(() => {
    // Load from localStorage for instant rendering
    try {
      const cached = localStorage.getItem('lst_inventories');
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
  const fetchInventories =
    async () => {

      try {
        // Don't show loading if we have cached data
        if (inventories.length === 0) {
          startLoading();
        }

        clearError();

        const response =
          await getInventories();

        setInventories(response.data || []);
        
        // Cache in localStorage
        localStorage.setItem('lst_inventories', JSON.stringify(response.data || []));

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

        const newInventories = (() => {
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
        })();
        
        setInventories(newInventories);
        
        // Update cache
        localStorage.setItem('lst_inventories', JSON.stringify(newInventories));

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

        const newInventories = inventories.filter(
          (inv) =>
            inv.inventoryId !==
            inventoryId
        );
        setInventories(newInventories);
        
        // Update cache
        localStorage.setItem('lst_inventories', JSON.stringify(newInventories));

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
    // Instant load from cache, then fetch fresh data
    if (inventories.length === 0) {
      fetchInventories();
    } else {
      // Background refresh without loading state
      fetchInventories();
    }
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventories,

        loading: false, // Never show loading state for cached data
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