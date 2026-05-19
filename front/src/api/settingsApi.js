import api from "./axios";


export const getSettings =
  async () => {

    try {

      const response =
        await api.get(
          "/settings"
        );

      return response.data;

    } catch (error) {

      console.log(error);

      return {
        success: false,
      };
    }
  };


export const updateSettings =
  async (data) => {

    try {

      const response =
        await api.post(
          "/settings",
          data
        );

      return response.data;

    } catch (error) {

      console.log(error);

      return {
        success: false,
      };
    }
  };


export const uploadQuotationPdf =
  async (formData) => {

    try {

      const response =
        await api.post(

          "/quotations/save-pdf",

          formData,

          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      return response.data;

    } catch (error) {

      console.log(error);

      return {
        success: false,
      };
    }
  };