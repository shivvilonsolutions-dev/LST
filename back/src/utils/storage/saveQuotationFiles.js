import path
  from "path";

import createStoragePath
  from "./createStoragePath.js";

import generateQuotationExcel
  from "../excel/generateQuotationExcel.js";

import convertExcelToPdf
  from "../pdf/convertExcelToPdf.js";


const saveQuotationFiles =
  async (
    quotationData
  ) => {

    const storagePath =
      createStoragePath();

    const safeClientName =
      quotationData.cliName
        .replace(/[<>:"/\\\\|?*]/g, "")
        .trim();

    const fileName = `${quotationData.quotationNo}_${safeClientName}`;
    console.log("File name:", fileName)

    const excelPath =
      path.join(
        storagePath,
        `${fileName}.xlsx`
      );


    const pdfPath =
      path.join(
        storagePath,
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


    return {

      excelPath,

      pdfPath,
    };
  };

export default
  saveQuotationFiles;