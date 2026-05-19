import {
  createQuotationService,
  getAllQuotationsService,
  getSingleQuotationService,
  updateQuotationService,
  deleteQuotationService,
} from "../services/quotationService.js";
import saveQuotationPdf from "../utils/saveQuotationPdf.js";

import fs from "fs";
import Quotation from "../models/local/Quotation.js";


export const createQuotation =
  async (req, res) => {

    try {

      const quotation =
        await createQuotationService(
          req.body
        );

      res.status(201).json({
        success: true,
        data: quotation,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getAllQuotations =
  async (req, res) => {

    try {

      const quotations =
        await getAllQuotationsService();

      res.status(200).json({
        success: true,
        data: quotations,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getSingleQuotation =
  async (req, res) => {

    try {

      const quotation =
        await getSingleQuotationService(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: quotation,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const updateQuotation =
  async (req, res) => {

    try {

      const quotation =
        await updateQuotationService(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        data: quotation,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteQuotation =
  async (req, res) => {

    try {

      await deleteQuotationService(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Quotation deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const saveQuotationPdfController =
  async (req, res) => {

    try {

      const pdfFile =
        req.file;

      const quotationNo =
        req.body.quotationNo;

      if (!pdfFile) {

        return res.status(400).json({
          success: false,

          message:
            "PDF file missing",
        });
      }

      const result =
        await saveQuotationPdf(

          pdfFile.buffer,

          quotationNo
        );

      if (!result.success) {

        return res.status(400).json({
          success: false,

          message:
            result.message,
        });
      }

      res.status(200).json({
        success: true,

        filePath:
          result.filePath,
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

export const downloadQuotationPdf =
  async (
    req,
    res
  ) => {

    try {

      const quotation =
        await Quotation.findById(
          req.params.id
        );

      if (!quotation) {

        return res.status(404)
          .json({

            success: false,

            message:
              "Quotation not found",
          });
      }


      if (
        !quotation.pdfPath
      ) {

        return res.status(404)
          .json({

            success: false,

            message:
              "PDF not generated",
          });
      }


      if (
        !fs.existsSync(
          quotation.pdfPath
        )
      ) {

        return res.status(404)
          .json({

            success: false,

            message:
              "PDF file missing",
          });
      }


      return res.download(
        quotation.pdfPath
      );

    }

    catch (error) {

      console.log(error);

      return res.status(500)
        .json({

          success: false,

          message:
            error.message,
        });
    }
  };