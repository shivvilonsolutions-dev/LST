import api from "./axios";

// GET ALL QUOTATIONS
export const getQuotations =
  async () => {

    const response =
      await api.get(
        "/quotations"
      );

    return response.data;
  };

// GET SINGLE QUOTATION
export const getSingleQuotation =
  async (id) => {

    const response =
      await api.get(
        `/quotations/${id}`
      );

    return response.data;
  };

// CREATE QUOTATION
export const createQuotation =
  async (data) => {

    const response =
      await api.post(
        "/quotations",
        data
      );

    return response.data;
  };

// UPDATE QUOTATION
export const updateQuotation =
  async (id, data) => {

    const response =
      await api.put(
        `/quotations/${id}`,
        data
      );

    return response.data;
  };

// DELETE QUOTATION
export const deleteQuotation =
  async (id) => {

    const response =
      await api.delete(
        `/quotations/${id}`
      );

    return response.data;
  };