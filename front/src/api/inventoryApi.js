import api from "./axios";

// GET ALL INVENTORIES
export const getInventories =
  async () => {

    const response =
      await api.get(
        "/inventories"
      );

    return response.data;
  };

// GET SINGLE INVENTORY
export const getSingleInventory =
  async (id) => {

    const response =
      await api.get(
        `/inventories/${id}`
      );

    return response.data;
  };

// CREATE / UPSERT INVENTORY
export const upsertInventory =
  async (data) => {

    const response =
      await api.post(
        "/inventories/upsert",
        data
      );

    return response.data;
  };

// DELETE INVENTORY
export const deleteInventory =
  async (id) => {

    const response =
      await api.delete(
        `/inventories/${id}`
      );

    return response.data;
  };

// DELETE PROPERTY
export const deleteProperty =
  async (
    inventoryId,
    propertyId
  ) => {

    const response =
      await api.delete(
        `/inventories/${inventoryId}/property/${propertyId}`
      );

    return response.data;
  };