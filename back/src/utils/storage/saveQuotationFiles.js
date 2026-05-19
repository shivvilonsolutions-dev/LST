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
    quotationData,
    basePath
  ) => {

    const storagePath =
      createStoragePath(
        basePath
      );


    const fileName = `${quotationData.quotationNo}_${quotationData.cliName}`;
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