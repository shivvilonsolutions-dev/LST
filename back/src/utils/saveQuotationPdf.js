import fs from "fs";
import path from "path";

import Settings
from "../models/local/Settings.js";


const saveQuotationPdf =
  async (
    pdfBuffer,
    quotationNo
  ) => {

    try {

      // GET SETTINGS

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

      const directoryPath =
        settings.offlinePdfPath;

      // ENSURE DIRECTORY EXISTS

      fs.mkdirSync(
        directoryPath,

        {
          recursive: true,
        }
      );

      // FILE NAME

      const fileName =
        `${quotationNo}.pdf`;

      const filePath =
        path.join(
          directoryPath,
          fileName
        );

      // SAVE FILE

      fs.writeFileSync(
        filePath,
        pdfBuffer
      );

      console.log(
        `PDF Saved: ${filePath}`
      );

      return {
        success: true,

        filePath,
      };

    } catch (error) {

      console.log(
        "PDF Save Error:",
        error
      );

      return {
        success: false,

        message:
          error.message,
      };
    }
  };

export default saveQuotationPdf;