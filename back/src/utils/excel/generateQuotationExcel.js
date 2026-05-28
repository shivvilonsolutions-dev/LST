import ExcelJS
  from "exceljs";

import path
  from "path";

const setCommonPageSetup =
  (sheet) => {


    // PAGE SETUP
    sheet.pageSetup = {

      paperSize: 9,

      orientation:
        "portrait",

      fitToPage: true,

      fitToWidth: 1,

      fitToHeight: 0,
    };
  };

const fillSmallQuotationSheet =
  (
    sheet,
    quotationData
  ) => {

    setCommonPageSetup(
      sheet
    );


    const blockRows =
      [1, 11, 21];


    blockRows.forEach(
      (startRow) => {

        // HEADER
        sheet.getCell(
          `C${startRow}`
        ).value =
          `SHREE:- ${quotationData.cliName}`;


        sheet.getCell(
          `F${startRow + 2}`
        ).value =
          `MO:- ${quotationData.mobile}`;


        sheet.getCell(
          `F${startRow + 3}`
        ).value =
          `RATE B:- ${quotationData.rateB1}`;


        sheet.getCell(
          `F${startRow + 4}`
        ).value =
          `RATE B:- ${quotationData.rateB2}`;


        sheet.getCell(
          `F${startRow + 5}`
        ).value =
          `ADD:- ${quotationData.add}`;


        sheet.getCell(
          `F${startRow + 6}`
        ).value =
          `BENDING:- ${quotationData.bending}`;


        // MATERIALS
        quotationData.materials.forEach(
          (
            item,
            index
          ) => {

            const row =
              startRow + 2 + index;

            sheet.getCell(
              `B${row}`
            ).value =
              index + 1;

            sheet.getCell(
              `C${row}`
            ).value =
              item.size;

            sheet.getCell(
              `D${row}`
            ).value =
              item.piece;

            sheet.getCell(
              `E${row}`
            ).value =
              item.gauge;
          }
        );
      }
    );
  };

const fillMediumQuotationSheet =
  (
    sheet,
    quotationData
  ) => {

    setCommonPageSetup(
      sheet
    );


    const blockRows =
      [1, 16];


    blockRows.forEach(
      (startRow) => {

        sheet.getCell(
          `C${startRow}`
        ).value =
          `SHREE:- ${quotationData.cliName}`;


        sheet.getCell(
          `F${startRow + 2}`
        ).value =
          `MO:- ${quotationData.mobile}`;


        sheet.getCell(
          `F${startRow + 4}`
        ).value =
          `RATE B:- ${quotationData.rateB1}`;


        sheet.getCell(
          `F${startRow + 5}`
        ).value =
          `ADD:- ${quotationData.add}`;


        sheet.getCell(
          `F${startRow + 6}`
        ).value =
          `CUTTING:- ${quotationData.bending}`;


        quotationData.materials.forEach(
          (
            item,
            index
          ) => {

            const row =
              startRow + 2 + index;

            sheet.getCell(
              `B${row}`
            ).value =
              index + 1;

            sheet.getCell(
              `C${row}`
            ).value =
              item.size;

            sheet.getCell(
              `D${row}`
            ).value =
              item.piece;

            sheet.getCell(
              `E${row}`
            ).value =
              item.gauge;
          }
        );
      }
    );
  };

const fillLargeQuotationSheet =
  (
    sheet,
    quotationData
  ) => {

    setCommonPageSetup(
      sheet
    );


    sheet.getCell("C1").value =
      `SHREE:- ${quotationData.cliName}`;


    sheet.getCell("F3").value =
      `MO:- ${quotationData.mobile}`;


    sheet.getCell("F5").value =
      `RATE B:- ${quotationData.rateB1}`;


    sheet.getCell("F6").value =
      `ADD:- ${quotationData.add}`;


    sheet.getCell("F7").value =
      `BENDING:- ${quotationData.bending}`;


    quotationData.materials.forEach(
      (
        item,
        index
      ) => {

        const row =
          3 + index;

        sheet.getCell(
          `B${row}`
        ).value =
          index + 1;

        sheet.getCell(
          `C${row}`
        ).value =
          item.size;

        sheet.getCell(
          `D${row}`
        ).value =
          item.piece;

        sheet.getCell(
          `E${row}`
        ).value =
          item.gauge;
      }
    );
  };


const generateQuotationExcel =
  async (
    quotationData,
    {
      outputPath = null,
      returnWorkbook = false,
    } = {}
  ) => {

    const workbook =
      new ExcelJS.Workbook();

    const templatePath =

      process.env.NODE_ENV ===
        "development"

        ? path.join(
          process.cwd(),
          "template",
          "quotation_template.xlsx"
        )

        : path.join(
          process.resourcesPath,
          "back",
          "template",
          "quotation_template.xlsx"
        );

    await workbook.xlsx.readFile(
      templatePath
    );


    // COUNT MATERIALS
    const materialCount =
      quotationData.materials
        .filter(
          (m) =>
            m.size ||
            m.piece ||
            m.gauge
        ).length;


    let selectedSheetName;


    // SHEET SELECTION
    if (
      materialCount <= 6
    ) {

      selectedSheetName =
        "11092017";

    }

    else if (
      materialCount <= 13
    ) {

      selectedSheetName =
        "Sheet2";

    }

    else {

      selectedSheetName =
        "Sheet3";
    }


    const sheet =
      workbook.getWorksheet(
        selectedSheetName
      );


    if (!sheet) {

      throw new Error(
        "Worksheet not found"
      );
    }


    // REMOVE OTHER SHEETS
    const sheetsToRemove =
      workbook.worksheets.filter(
        (ws) =>
          ws.name !==
          selectedSheetName
      );

    sheetsToRemove.forEach(
      (ws) => {

        workbook.removeWorksheet(
          ws.id
        );
      }
    );


    // FILL DATA
    if (
      selectedSheetName ===
      "11092017"
    ) {

      fillSmallQuotationSheet(
        sheet,
        quotationData
      );
    }
    else if (
      selectedSheetName ===
      "Sheet2"
    ) {

      fillMediumQuotationSheet(
        sheet,
        quotationData
      );
    }
    else {

      fillLargeQuotationSheet(
        sheet,
        quotationData
      );
    }


    // SAVE FILE
    if (outputPath) {
      await workbook.xlsx.writeFile(
        outputPath
      );

      return {

        success: true,

        excelPath:
          outputPath,
      };
    }


    if (returnWorkbook) {
      return {

        success: true,

        workbook,
      };
    }


    return {

      success: false,

      message:
        "No output mode selected",
    };
  };

export default
  generateQuotationExcel;