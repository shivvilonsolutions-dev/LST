import ExcelJS
  from "exceljs";

import path
  from "path";

const setCommonPageSetup =
  (sheet) => {

    sheet.pageSetup = {

      paperSize: 9,

      orientation:
        "portrait",

      fitToPage: true,

      fitToWidth: 1,

      fitToHeight: 1,

      horizontalCentered: true,

      margins: {

        left: 0.3,

        right: 0.3,

        top: 0.3,

        bottom: 0.3,
      },
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


        const date =
          quotationData.createdAt
            ? new Date(
              quotationData.createdAt
            )
            : new Date();


        sheet.getCell(
          `F${startRow + 1}`
        ).value =
          date;


        sheet.getCell(
          `F${startRow + 1}`
        ).numFmt =
          "m/d/yyyy hh:mm";


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


        const date =
          quotationData.createdAt
            ? new Date(
              quotationData.createdAt
            )
            : new Date();


        sheet.getCell(
          `F${startRow + 1}`
        ).value =
          date;


        sheet.getCell(
          `F${startRow + 1}`
        ).numFmt =
          "m/d/yyyy hh:mm";


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


    const date =
      quotationData.createdAt
        ? new Date(
          quotationData.createdAt
        )
        : new Date();


    sheet.getCell("F2").value =
      date;

    sheet.getCell("F2").numFmt =
      "m/d/yyyy hh:mm";


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
    outputPath
  ) => {

    const workbook =
      new ExcelJS.Workbook();


    const templatePath =
      path.join(
        process.cwd(),
        "src",
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


    // HIDE OTHER SHEETS
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
    await workbook.xlsx.writeFile(
      outputPath
    );
  };

export default
  generateQuotationExcel;