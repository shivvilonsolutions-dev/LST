import libre
  from "libreoffice-convert";

import fs
  from "fs";

import { promisify }
  from "util";


const convertAsync =
  promisify(
    libre.convert
  );

const convertExcelToPdf =
  async ({
    excelPath,
    pdfPath,
    deleteExcelAfterConversion = false,
    returnPdfBuffer = false,
  }) => {

    try {

      const fileBuffer =
        fs.readFileSync(
          excelPath
        );

      const pdfBuffer =
        await convertAsync(
          fileBuffer,
          ".pdf",
          undefined
        );

      let finalPdfPath =
        pdfPath;

      if (!finalPdfPath) {

        finalPdfPath =
          excelPath.replace(
            /\.xlsx$/,
            ".pdf"
          );
      }

      fs.writeFileSync(
        finalPdfPath,
        pdfBuffer
      );

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