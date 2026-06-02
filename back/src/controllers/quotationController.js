import {
  createQuotationService,
  getAllQuotationsService,
  getSingleQuotationService,
  updateQuotationService,
  deleteQuotationService,
  updateQuotationStatusService
} from "../services/quotationService.js";
import getModels from "../models/getModels.js";
import createStoragePath
  from "../utils/storage/createStoragePath.js";
import generateQuotationExcel from "../utils/excel/generateQuotationExcel.js";
import convertExcelToPdf from "../utils/pdf/convertExcelToPdf.js";

import path from "path";
import fs from "fs";

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
      console.log(
        "CREATE QUOTATION ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

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

export const downloadQuotationExcel =
  async (
    req,
    res
  ) => {

    try {

      const {
        quotationNo,
      } = req.params;


      const {
        LocalQuotation,
      } = getModels();


      const quotation =
        await LocalQuotation.findOne({

          quotationNo,
        });


      if (!quotation) {

        return res.status(404).json({

          success: false,

          message:
            "Quotation not found",
        });
      }

      const storagePathForExcel =
        await createStoragePath(
          "excel-files"
        );

      const safeClientName =
        quotation.cliName

          ?.replace(
            /[<>:"/\\|?*]/g,
            ""
          )

          ?.trim();


      const fileName =
        `${safeClientName}_${quotationNo}`;

      const excelPath =
        path.join(

          storagePathForExcel,

          `${fileName}.xlsx`
        );


      const result =
        await generateQuotationExcel(

          quotation,

          {
            outputPath:
              excelPath,
            
            templateType:
              "excel",
          }
        );


      return res.status(200).json({

        success: true,

        excelPath:
          result.excelPath,

        fileName:
          `${quotationNo}.xlsx`,
      });

    }

    catch (error) {

      console.log(error);

      return res.status(500).json({

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

      const {
        quotationNo,
      } = req.params;


      const {
        LocalQuotation,
      } = getModels();


      const quotation =
        await LocalQuotation.findOne({

          quotationNo,
        });


      if (!quotation) {

        return res.status(404).json({

          success: false,

          message:
            "Quotation not found",
        });
      }

      const excelStoragePath =
        await createStoragePath(
          "excel-files"
        );

      const pdfStoragePath =
        await createStoragePath(
          "pdf-files"
        );

      const safeClientName =
        quotation.cliName

          ?.replace(
            /[<>:"/\\|?*]/g,
            ""
          )

          ?.trim();


      const fileName =
        `${safeClientName}_${quotationNo}`;

      const tempExcelPath =
        path.join(

          excelStoragePath,

          `${fileName}_TEMP.xlsx`
        );


      const pdfPath =
        path.join(

          pdfStoragePath,

          `${fileName}.pdf`
        );


      // GENERATE TEMP EXCEL
      await generateQuotationExcel(

        quotation,

        {
          outputPath:
            tempExcelPath,

          templateType:
            "pdf",
        }
      );


      // CONVERT TO PDF
      const pdfResult =
        await convertExcelToPdf({

          excelPath:
            tempExcelPath,

          pdfPath,

          deleteExcelAfterConversion:
            true,
        });


      return res.status(200).json({

        success: true,

        pdfPath:
          pdfResult.pdfPath,

        fileName:
          `${quotationNo}.pdf`,
      });

    }

    catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const generateWhatsappPdf =
  async (
    req,
    res
  ) => {

    try {

      const {
        quotationNo,
      } = req.params;


      const {
        LocalQuotation,
      } = getModels();


      const quotation =
        await LocalQuotation.findOne({

          quotationNo,
        });


      if (!quotation) {

        return res.status(404).json({

          success: false,

          message:
            "Quotation not found",
        });
      }

      const excelStoragePath =
        await createStoragePath(
          "excel-files"
        );

      const pdfStoragePath =
        await createStoragePath(
          "pdf-files"
        );

      const safeClientName =
        quotation.cliName

          ?.replace(
            /[<>:"/\\|?*]/g,
            ""
          )

          ?.trim();


      const fileName =
        `${safeClientName}_${quotationNo}`;

      const tempExcelPath =
        path.join(

          excelStoragePath,

          `${fileName}_TEMP.xlsx`
        );


      const pdfPath =
        path.join(

          pdfStoragePath,

          `${fileName}.pdf`
        );


      await generateQuotationExcel(

        quotation,

        {
          outputPath:
            tempExcelPath,
          
          templateType:
            "pdf",
        }
      );


      const pdfResult =
        await convertExcelToPdf({

          excelPath:
            tempExcelPath,

          pdfPath,

          deleteExcelAfterConversion:
            true,
        });


      return res.status(200).json({

        success: true,

        pdfPath:
          pdfResult.pdfPath,
      });

    }

    catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const updateQuotationStatus =
  async (
    req,
    res
  ) => {

    try {

      const {
        quotationNo,
      } = req.params;


      const {
        status,
      } = req.body;


      const quotation =
        await updateQuotationStatusService(

          quotationNo,

          status
        );


      return res.status(200).json({

        success: true,

        data:
          quotation,
      });

    }

    catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };