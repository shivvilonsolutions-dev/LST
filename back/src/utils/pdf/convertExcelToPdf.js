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
  async (
    excelPath,
    pdfPath
  ) => {

    const file =
      fs.readFileSync(
        excelPath
      );


    const pdfBuffer =
      await convertAsync(

        file,

        ".pdf",

        undefined
      );


    fs.writeFileSync(

      pdfPath,

      pdfBuffer
    );
  };

export default
  convertExcelToPdf;