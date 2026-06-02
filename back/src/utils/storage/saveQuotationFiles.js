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

    const excelStoragePath =
      createStoragePath(
        "excel-files"
      );

    const pdfStoragePath =
      createStoragePath(
        "pdf-files"
      );

    const safeClientName =
      quotationData.cliName
        ?.replace(
          /[<>:"/\\|?*]/g,
          ""
        )
        ?.trim();


    const fileName = `${safeClientName}_${quotationData.quotationNo}`;

    console.log("File name:", fileName)

    const excelPath =
      path.join(
        excelStoragePath,
        `${fileName}.xlsx`
      );


    const pdfPath =
      path.join(
        pdfStoragePath,
        `${fileName}.pdf`
      );


    // GENERATE EXCEL
    await generateQuotationExcel(
      quotationData,
      {
        outputPath:
          excelPath,
          
        templateType:
          "excel",
      }
    );


    // GENERATE PDF
    await convertExcelToPdf({
      excelPath,

      pdfPath,
    });


    return {

      excelPath,

      pdfPath,
    };
  };

export default
  saveQuotationFiles;