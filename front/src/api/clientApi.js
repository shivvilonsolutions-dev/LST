import api from "./axios";

// GET ALL CLIENTS
export const getClients =
  async () => {

    const response =
      await api.get(
        "/clients"
      );

    return response.data;
  };

// GET SINGLE CLIENT
export const getSingleClient =
  async (id) => {

    const response =
      await api.get(
        `/clients/${id}`
      );

    return response.data;
  };

// CREATE CLIENT
export const createClient =
  async (data) => {

    const response =
      await api.post(
        "/clients",
        data
      );

    return response.data;
  };

// UPDATE CLIENT
export const updateClient =
  async (id, data) => {

    const response =
      await api.put(
        `/clients/${id}`,
        data
      );

    return response.data;
  };

// DELETE CLIENT
export const deleteClient =
  async (id) => {

    const response =
      await api.delete(
        `/clients/${id}`
      );

    return response.data;
  };