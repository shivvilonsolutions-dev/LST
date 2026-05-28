import libre
from "libreoffice-convert";

import fs
from "fs";

import path
from "path";

import { promisify }
from "util";


const convertAsync =
  promisify(
    libre.convert
  );


const convertExcelToPdf =
  async (

    {
      excelPath,
      pdfPath,
      deleteExcelAfterConversion = false,
      returnPdfBuffer = false,
    }
  ) => {

    try {

      // READ EXCEL
      const fileBuffer =
        fs.readFileSync(
          excelPath
        );


      // CONVERT TO PDF BUFFER
      const pdfBuffer =
        await convertAsync(

          fileBuffer,

          ".pdf",

          undefined
        );


      // AUTO GENERATE PDF PATH
      let finalPdfPath =
        pdfPath;


      if (!finalPdfPath) {

        finalPdfPath =
          excelPath.replace(
            /\.xlsx$/,
            ".pdf"
          );
      }


      // SAVE PDF
      fs.writeFileSync(

        finalPdfPath,

        pdfBuffer
      );


      // DELETE TEMP EXCEL
      if (
        deleteExcelAfterConversion &&
        fs.existsSync(
          excelPath
        )
      ) {

        fs.unlinkSync(
          excelPath
        );
      }


      // RETURN BUFFER MODE
      if (
        returnPdfBuffer
      ) {

        return {

          success: true,

          pdfBuffer,

          pdfPath:
            finalPdfPath,
        };
      }


      // NORMAL RETURN
      return {

        success: true,

        pdfPath:
          finalPdfPath,
      };

    }

    catch (error) {

      console.log(

        "PDF Conversion Error:",

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
  convertExcelToPdf;