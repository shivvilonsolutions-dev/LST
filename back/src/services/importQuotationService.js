import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import {
  getCurrentUserId,
} from "../config/setDatabase.js";
import {
  createQuotationService,
} from "./quotationService.js";

const cleanValue =
  (value) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "";
    }

    return String(
      value
    ).trim();
  };


const extractText =
  (
    value,
    prefix
  ) => {

    return cleanValue(
      value
    )
      .replace(
        prefix,
        ""
      )
      .trim();
  };
const parseExcelDate =
  (rawDate) => {

    // REAL JS DATE
    if (
      rawDate instanceof Date &&
      !isNaN(rawDate)
    ) {

      return rawDate;
    }


    // FORMULA CELL
    if (
      rawDate &&
      typeof rawDate === "object" &&
      rawDate.result
    ) {

      // RESULT IS ALREADY DATE
      if (
        rawDate.result instanceof Date &&
        !isNaN(rawDate.result)
      ) {

        return rawDate.result;
      }


      // RESULT IS SERIAL NUMBER
      if (
        typeof rawDate.result ===
        "number"
      ) {

        return new Date(
          Math.round(
            (
              rawDate.result - 25569
            ) * 86400 * 1000
          )
        );
      }
    }


    // EXCEL SERIAL NUMBER
    if (
      typeof rawDate ===
      "number"
    ) {

      return new Date(
        Math.round(
          (
            rawDate - 25569
          ) * 86400 * 1000
        )
      );
    }


    // STRING DATE
    if (
      typeof rawDate ===
      "string"
    ) {

      const parsed =
        new Date(rawDate);

      if (
        !isNaN(parsed)
      ) {

        return parsed;
      }
    }


    return null;
  };

const parseBlock =
  (
    sheet,
    startRow,
    maxRows,
    filePaths
  ) => {

    const header =
      cleanValue(

        sheet.getCell(
          `C${startRow}`
        ).value
      );


    if (
      !header.includes(
        "SHREE"
      )
    ) {

      return null;
    }



    const cliName =
      extractText(
        header,
        "SHREE:-"
      );


    const rawDate =
      sheet.getCell(
        `F${startRow + 1}`
      ).value;

    console.log("Date from excel: ", rawDate)

    const quotationDate =
      parseExcelDate(
        rawDate
      );

    const mobile =
      extractText(

        sheet.getCell(
          `F${startRow + 2}`
        ).value,

        "MO:-"
      );


    const rateB1 =
      extractText(

        sheet.getCell(
          `F${startRow + 3}`
        ).value,

        "RATE B:-"
      );


    const rateB2 =
      extractText(

        sheet.getCell(
          `F${startRow + 4}`
        ).value,

        "RATE B:-"
      );


    const add =
      extractText(

        sheet.getCell(
          `F${startRow + 5}`
        ).value,

        "ADD:-"
      );


    const bending =
      extractText(

        sheet.getCell(
          `F${startRow + 6}`
        ).value,

        "BENDING:-"
      )

    const materials =
      [];


    for (
      let i = 0;
      i < maxRows;
      i++
    ) {

      const row =
        startRow + 2 + i;


      const size =
        cleanValue(

          sheet.getCell(
            `C${row}`
          ).value
        );


      const piece =
        cleanValue(

          sheet.getCell(
            `D${row}`
          ).value
        );


      const gauge =
        cleanValue(

          sheet.getCell(
            `E${row}`
          ).value
        );


      if (
        size &&
        size !== "0"
      ) {

        materials.push({

          size,

          piece,

          gauge,
        });
      }
    }


    if (
      materials.length === 0
    ) {

      return null;
    }


    if (!mobile) {
      return null;
    }

    const timestamp = Date.now() + Math.random();

    if (
      !quotationDate
    ) {

      console.log(
        "Invalid quotation date:",
        rawDate
      );

      return null;
    }

    return {

      quotationNo:
        `Q_${mobile}_${timestamp}`,

      cliId:
        `CLI_${mobile}`,

      cliName,

      mobile,

      whatsapp:
        mobile,

      quotationDate,

      materials,

      rateB1,

      rateB2,

      bending,

      laserCutting:
        "",

      add,

      status:
        "CONFIRM",

      isSynced:
        false,

      sourceFileName:
        filePaths.fileName,

      isImported:
        true,
    };
  };


const getSheetConfig =
  (sheetName) => {

    if (
      sheetName ===
      "11092017"
    ) {

      return {

        blockRows:
          [1, 11, 21],

        maxRows:
          6,
      };
    }


    if (
      sheetName ===
      "Sheet2"
    ) {

      return {

        blockRows:
          [1, 16],

        maxRows:
          12,
      };
    }


    return {

      blockRows:
        [1],

      maxRows:
        26,
    };
  };


export const importQuotationFolderService =
  async (
    folderPath
  ) => {

    const userId =
      getCurrentUserId()
      || "ADMIN001";


    const importFolder =
      path.join(

        "D:\\LST_Local_Files",

        userId,

        "Imported"
      );


    if (
      !fs.existsSync(
        importFolder
      )
    ) {

      fs.mkdirSync(

        importFolder,

        {
          recursive: true,
        }
      );
    }


    const files =
      fs.readdirSync(
        folderPath
      );


    const excelFiles =
      files.filter(
        (file) =>
          file.endsWith(
            ".xlsx"
          )
      );


    let totalInserted =
      0;


    for (
      const file of excelFiles
    ) {

      try {

        const originalPath =
          path.join(
            folderPath,
            file
          );


        const savedExcelPath =
          path.join(
            importFolder,
            file
          );


        fs.copyFileSync(
          originalPath,
          savedExcelPath
        );


        const workbook =
          new ExcelJS.Workbook();

        await workbook.xlsx.readFile(
          originalPath
        );


        for (
          const sheet
          of workbook.worksheets
        ) {

          const config =
            getSheetConfig(
              sheet.name
            );


          for (
            const startRow
            of config.blockRows
          ) {

            const quotation =
              parseBlock(

                sheet,

                startRow,

                config.maxRows,

                {
                  fileName:
                    file,
                }
              );


            if (
              quotation
            ) {
              await createQuotationService({

                ...quotation,

                isImported:
                  true,

                skipDuplicateValidation:
                  true,
              });

              totalInserted++;
            }
          }
        }

        console.log(
          `Imported: ${file}`
        );

      }

      catch (error) {

        console.log(
          `Failed: ${file}`
        );

        console.log(
          error.message
        );
      }
    }


    return {

      success: true,

      message:
        `${totalInserted} quotations imported successfully`,
    };
  };