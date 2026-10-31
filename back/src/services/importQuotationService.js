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

const extractText = (
  value,
  prefix
) => {

  const text =
    cleanValue(value);

  if (!text) {
    return "";
  }

  const index =
    text.indexOf(prefix);

  if (index === -1) {
    return "";
  }

  return text
    .substring(
      index + prefix.length
    )
    .trim();
};

const parseExcelDate = (rawDate, fallbackDate = null) => {
  // REAL JS DATE
  if (rawDate instanceof Date && !isNaN(rawDate)) {
    return rawDate;
  }

  // FORMULA CELL
  if (rawDate && typeof rawDate === "object") {
    if (rawDate.result instanceof Date && !isNaN(rawDate.result)) {
      return rawDate.result;
    }
    if (typeof rawDate.result === "number") {
      return new Date(Math.round((rawDate.result - 25569) * 86400 * 1000));
    }
    if (typeof rawDate.result === "string") {
      rawDate = rawDate.result;
    }
  }

  // EXCEL SERIAL NUMBER
  if (typeof rawDate === "number" && !isNaN(rawDate)) {
    return new Date(Math.round((rawDate - 25569) * 86400 * 1000));
  }

  // STRING DATE
  if (typeof rawDate === "string") {
    let clean = rawDate
      .replace(/^(DATE|DT)\s*[:-]\s*/i, "")
      .replace(/SHREE\s*[:-]/i, "")
      .trim();

    if (!clean) return fallbackDate || new Date();

    // Direct native parse
    let parsed = new Date(clean);
    if (!isNaN(parsed) && parsed.getFullYear() > 1990 && parsed.getFullYear() < 2100) {
      return parsed;
    }

    // Handle DD/MM/YYYY or DD-MM-YYYY or MM/DD/YYYY formats with optional time
    const dmyRegex = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})(?:\s*[, ]\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?)?$/i;
    const match = clean.match(dmyRegex);
    if (match) {
      let [, p1, p2, p3, hours, minutes, seconds, ampm] = match;
      let day, month, year;
      let num1 = parseInt(p1, 10);
      let num2 = parseInt(p2, 10);
      let num3 = parseInt(p3, 10);
      if (num3 < 100) num3 += 2000;

      if (num1 > 12) {
        day = num1;
        month = num2 - 1;
        year = num3;
      } else if (num2 > 12) {
        month = num1 - 1;
        day = num2;
        year = num3;
      } else {
        // Default Indian format: DD/MM/YYYY
        day = num1;
        month = num2 - 1;
        year = num3;
      }

      let h = hours ? parseInt(hours, 10) : 0;
      let m = minutes ? parseInt(minutes, 10) : 0;
      let s = seconds ? parseInt(seconds, 10) : 0;
      if (ampm) {
        const upper = ampm.toUpperCase();
        if (upper === "PM" && h < 12) h += 12;
        if (upper === "AM" && h === 12) h = 0;
      }

      const d = new Date(year, month, day, h, m, s);
      if (!isNaN(d)) return d;
    }

    // Handle named months e.g. "16 SEPT 2026, 02:56 PM" or "27 OCT 2026"
    const textDateMatch = clean.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{2,4})(?:\s*[, ]\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?)?$/i);
    if (textDateMatch) {
      let [, dayStr, monthStr, yearStr, hours, minutes, seconds, ampm] = textDateMatch;
      const monthMap = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
      };
      const mIdx = monthStr.toLowerCase().startsWith("sept") ? 8 : (monthMap[monthStr.toLowerCase().slice(0, 3)] ?? -1);
      if (mIdx !== -1) {
        let y = parseInt(yearStr, 10);
        if (y < 100) y += 2000;
        let d = parseInt(dayStr, 10);
        let h = hours ? parseInt(hours, 10) : 0;
        let m = minutes ? parseInt(minutes, 10) : 0;
        let s = seconds ? parseInt(seconds, 10) : 0;
        if (ampm) {
          const upper = ampm.toUpperCase();
          if (upper === "PM" && h < 12) h += 12;
          if (upper === "AM" && h === 12) h = 0;
        }
        const parsedText = new Date(y, mIdx, d, h, m, s);
        if (!isNaN(parsedText)) return parsedText;
      }
    }
  }

  return fallbackDate || new Date();
};

const getMaterials =
  (
    sheet,
    startRow,
    maxRows
  ) => {

    const materials = [];

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

      const rawPiece =
        sheet.getCell(
          `D${row}`
        ).value;

      const piece =
        rawPiece === null ||
          rawPiece === undefined ||
          rawPiece === ""

          ? ""

          : Number(rawPiece);

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

    return materials;
  };

const calculateTotalPieces =
  (materials = []) => {

    return materials.reduce(

      (sum, item) =>

        sum +
        (
          Number(item.piece) || 0
        ),

      0
    );
  };

const parseSmallQuotation =
  (
    sheet,
    startRow,
    fileName,
    fallbackDate = null
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

    const quotationDate =
      parseExcelDate(
        rawDate,
        fallbackDate
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
      );

    const materials =
      getMaterials(
        sheet,
        startRow,
        6
      );

    if (
      !quotationDate ||
      !mobile ||
      materials.length === 0
    ) {

      return null;
    }

    const totalPieces =
      calculateTotalPieces(
        materials
      );

    const timestamp =
      Date.now() + Math.random();

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

      totalPieces,

      rateB1,

      rateB2,

      add,

      bending,

      laserCutting: "",

      status:
        "CONFIRM",

      isSynced:
        false,

      sourceFileName:
        fileName,

      isImported:
        true,
    };
  };

const parseMediumQuotation =
  (
    sheet,
    startRow,
    fileName,
    fallbackDate = null
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

    const quotationDate =
      parseExcelDate(
        rawDate,
        fallbackDate
      );

    const mobile =
      extractText(
        sheet.getCell(
          `F${startRow + 2}`
        ).value,
        "MO:-"
      );

    const f4 =
      cleanValue(
        sheet.getCell(`F${startRow + 3}`).value
      );

    const f5 =
      cleanValue(
        sheet.getCell(`F${startRow + 4}`).value
      );

    let rateB1 = "";
    let rateB2 = "";

    if (
      f4.includes("RATE B:-") &&
      f4.replace("RATE B:-", "").trim()
    ) {

      rateB1 =
        extractText(
          f4,
          "RATE B:-"
        );
    }
    else {

      rateB2 =
        extractText(
          f5,
          "RATE B:-"
        );
    }

    const add =
      extractText(
        sheet.getCell(
          `F${startRow + 5}`
        ).value,
        "ADD:-"
      );

    const laserCutting =
      extractText(
        sheet.getCell(
          `F${startRow + 6}`
        ).value,
        "CUTTING:-"
      );

    const materials =
      getMaterials(
        sheet,
        startRow,
        11
      );

    if (
      !quotationDate ||
      !mobile ||
      materials.length === 0
    ) {

      return null;
    }

    const totalPieces =
      calculateTotalPieces(
        materials
      );

    const timestamp =
      Date.now() + Math.random();

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

      totalPieces,

      rateB1,

      rateB2,

      add,

      bending:
        "",

      laserCutting,

      status:
        "CONFIRM",

      isSynced:
        false,

      sourceFileName:
        fileName,

      isImported:
        true,
    };
  };

const parseLargeQuotation =
  (
    sheet,
    fileName,
    fallbackDate = null
  ) => {

    const header =
      cleanValue(
        sheet.getCell(
          "C1"
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
        "F2"
      ).value;

    const quotationDate =
      parseExcelDate(
        rawDate,
        fallbackDate
      );

    const mobile =
      extractText(
        sheet.getCell(
          "F3"
        ).value,
        "MO:-"
      );

    const f4 =
      cleanValue(
        sheet.getCell("F4").value
      );

    const f5 =
      cleanValue(
        sheet.getCell("F5").value
      );

    let rateB1 = "";
    let rateB2 = "";

    if (
      f4.includes("RATE W:-")
    ) {

      rateB1 =
        extractText(
          f4,
          "RATE W:-"
        );
    }

    if (
      f5.includes("RATE B:-")
    ) {

      rateB2 =
        extractText(
          f5,
          "RATE B:-"
        );
    }

    const add =
      extractText(
        sheet.getCell(
          "F6"
        ).value,
        "ADD:-"
      );

    const f7 =
      cleanValue(
        sheet.getCell("F7").value
      );

    let bending = "";
    let laserCutting = "";

    if (
      f7.startsWith("BENDING:-")
    ) {
      bending =
        extractText(
          f7,
          "BENDING:-"
        );
    }
    else if (
      f7.startsWith("CUTTING:-")
    ) {
      laserCutting =
        extractText(
          f7,
          "CUTTING:-"
        );
    }

    const materials =
      getMaterials(
        sheet,
        1,
        26
      );

    if (
      !quotationDate ||
      !mobile ||
      materials.length === 0
    ) {

      return null;
    }

    const totalPieces =
      calculateTotalPieces(
        materials
      );

    const timestamp =
      Date.now() + Math.random();

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

      totalPieces,

      rateB1,

      rateB2,

      add,

      bending,

      laserCutting,

      status:
        "CONFIRM",

      isSynced:
        false,

      sourceFileName:
        fileName,

      isImported:
        true,
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

        const fileMtime = fs.existsSync(originalPath)
          ? fs.statSync(originalPath).mtime
          : new Date();

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

          const quotations =
            [];

          if (
            sheet.name ===
            "11092017"
          ) {

            [1, 11, 21]
              .forEach(
                (startRow) => {

                  const quotation =
                    parseSmallQuotation(
                      sheet,
                      startRow,
                      file,
                      fileMtime
                    );

                  if (
                    quotation
                  ) {

                    quotations.push(
                      quotation
                    );
                  }
                }
              );
          }

          else if (
            sheet.name ===
            "Sheet2"
          ) {

            [1, 16]
              .forEach(
                (startRow) => {

                  const quotation =
                    parseMediumQuotation(
                      sheet,
                      startRow,
                      file,
                      fileMtime
                    );

                  if (
                    quotation
                  ) {

                    quotations.push(
                      quotation
                    );
                  }
                }
              );
          }

          else if (
            sheet.name ===
            "Sheet3"
          ) {

            const quotation =
              parseLargeQuotation(
                sheet,
                file,
                fileMtime
              );

            if (
              quotation
            ) {

              quotations.push(
                quotation
              );
            }
          }

          for (
            const quotation
            of quotations
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