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
    try {

      const response =
        await api.post(
          "/quotations",
          data
        );

      return response.data;

    }

    catch (error) {

      console.log(
        "Create Quotation API Error:",
        error
      );

      return {

        success: false,

        message:
          error.response?.data?.message
          || "Quotation creation failed",
      };
    }
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

// DOWNLOAD EXCEL
export const downloadQuotationExcel =
  async (quotationNo) => {

    try {

      const response =
        await api.get(

          `/quotations/${quotationNo}/excel`
        );

      return response.data;

    }

    catch (error) {

      return {

        success: false,

        message:
          error.response?.data?.message
          || "Excel generation failed",
      };
    }
  };


// DOWNLOAD PDF
export const downloadQuotationPdf =
  async (quotationNo) => {

    try {

      const response =
        await api.get(

          `/quotations/${quotationNo}/pdf`
        );

      return response.data;

    }

    catch (error) {

      return {

        success: false,

        message:
          error.response?.data?.message
          || "PDF generation failed",
      };
    }
  };


// WHATSAPP PDF
export const generateWhatsappPdf =
  async (quotationNo) => {

    try {

      const response =
        await api.get(

          `/quotations/${quotationNo}/whatsapp-pdf`
        );

      return response.data;

    }

    catch (error) {

      return {

        success: false,

        message:
          error.response?.data?.message
          || "WhatsApp PDF failed",
      };
    }
  };

// UPDATE QUOTATION STATUS
export const updateQuotationStatus =
  async (
    quotationNo,
    status
  ) => {

    try {

      const response =
        await api.patch(

          `/quotations/${quotationNo}/status`,

          {
            status,
          }
        );

      return response.data;

    }

    catch (error) {

      return {

        success: false,

        message:
          error.response?.data?.message
          || "Status update failed",
      };
    }
  };