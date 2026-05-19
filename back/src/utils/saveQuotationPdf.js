import fs from "fs";
import path from "path";

import Settings from "../models/local/Settings.js";
import generateQuotationExcel from "./excel/generateQuotationExcel.js";
import convertExcelToPdf from "./pdf/convertExcelToPdf.js";

const saveQuotationPdf =
  async (
    quotationData
  ) => {

    try {

      // SETTINGS
      const settings =
        await Settings.findOne();

      if (
        !settings
          ?.offlinePdfPath
      ) {

        throw new Error(
          "Offline PDF path not configured"
        );
      }


      // BASE DIRECTORY
      const baseDirectory =
        settings.offlinePdfPath;


      // DATE FOLDER
      const now =
        new Date();

      const month =
        now.toLocaleString(
          "default",
          {
            month: "long",
          }
        );

      const dayFolder =
        `${now.getDate()}-${month}`;


      // FINAL PATH
      const finalDirectory =
        path.join(
          baseDirectory,
          month,
          dayFolder
        );


      // CREATE DIRECTORY
      fs.mkdirSync(
        finalDirectory,
        {
          recursive: true,
        }
      );


      // FILE NAME
      const fileName =
        quotationData
          .quotationNo;


      // XLSX PATH
      const excelPath =
        path.join(
          finalDirectory,
          `${fileName}.xlsx`
        );


      // PDF PATH
      const pdfPath =
        path.join(
          finalDirectory,
          `${fileName}.pdf`
        );


      // GENERATE EXCEL
      await generateQuotationExcel(

        quotationData,

        excelPath
      );


      // GENERATE PDF
      await convertExcelToPdf(

        excelPath,

        pdfPath
      );


      console.log(

        `Quotation Files Saved: ${finalDirectory}`
      );


      return {

        success: true,

        excelPath,

        pdfPath,
      };

    } catch (error) {

      console.log(
        "Quotation Save Error:",
        error
      );

      return {

        success: false,

        message:
          error.message,
      };
    }
  };

export default
  saveQuotationPdf;