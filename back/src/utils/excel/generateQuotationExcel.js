import ExcelJS from "exceljs";
import path from "path";

const setCommonPageSetup =
  (sheet) => {

    sheet.pageSetup = {

      paperSize: 9,

      orientation: "portrait",

      scale: 89,

      margins: {

        left: 2.01,
        right: 2.05,

        top: 0.16,
        bottom: 5.88,

        header: 0.16,
        footer: 0.3,
      },
    };
  };

const calculateTotalPieces =
  (materials = []) => {

    return materials.reduce(

      (total, item) =>

        total +
        (
          Number(item.piece) || 0
        ),

      0
    );
  };

const fillSmallQuotationSheet =
  (
    sheet,
    quotationData,
    templateType
  ) => {

    setCommonPageSetup(
      sheet
    );

    const blockRows =
      templateType === "pdf"
        ? [1]
        : [1, 11, 21];

    blockRows.forEach(
      (startRow) => {

        // HEADER
        sheet.getCell(
          `C${startRow}`
        ).value =
          `SHREE:- ${quotationData.cliName}`;

        const date =
          new Date(
            quotationData.quotationDate
          );

        sheet.getCell(
          `F${startRow + 1}`
        ).value =
          `${String(date.getMonth() + 1).padStart(2, "0")}/` +
          `${String(date.getDate()).padStart(2, "0")}/` +
          `${date.getFullYear()} ` +
          `${String(date.getHours()).padStart(2, "0")}:` +
          `${String(date.getMinutes()).padStart(2, "0")}`;

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

        sheet.getCell(
          `D${startRow + 9}`
        ).value =
          calculateTotalPieces(
            quotationData.materials
          );

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
              Number(item.piece) || "";

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
    quotationData,
    templateType
  ) => {

    setCommonPageSetup(
      sheet
    );


    const blockRows =
      templateType === "pdf"
        ? [1]
        : [1, 16];


    blockRows.forEach(
      (startRow) => {

        sheet.getCell(
          `C${startRow}`
        ).value =
          `SHREE:- ${quotationData.cliName}`;

        const date =
          new Date(
            quotationData.quotationDate
          );

        sheet.getCell(
          `F${startRow + 1}`
        ).value =
          `${String(date.getMonth() + 1).padStart(2, "0")}/` +
          `${String(date.getDate()).padStart(2, "0")}/` +
          `${date.getFullYear()} ` +
          `${String(date.getHours()).padStart(2, "0")}:` +
          `${String(date.getMinutes()).padStart(2, "0")}`;

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
          `CUTTING:- ${quotationData.laserCutting}`;


        sheet.getCell(
          `D${startRow + 14}`
        ).value =
          calculateTotalPieces(
            quotationData.materials
          );


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
              Number(item.piece) || "";

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
      new Date(
        quotationData.quotationDate
      );

    sheet.getCell(
      "F2"
    ).value =
      `${String(date.getMonth() + 1).padStart(2, "0")}/` +
      `${String(date.getDate()).padStart(2, "0")}/` +
      `${date.getFullYear()} ` +
      `${String(date.getHours()).padStart(2, "0")}:` +
      `${String(date.getMinutes()).padStart(2, "0")}`;

    sheet.getCell("F3").value =
      `MO:- ${quotationData.mobile}`;


    sheet.getCell("F4").value =
      `RATE W:- ${quotationData.rateB1}`;

    sheet.getCell("F5").value =
      `RATE B:- ${quotationData.rateB2}`;


    sheet.getCell("F6").value =
      `ADD:- ${quotationData.add}`;


    sheet.getCell("F7").value =
      `BENDING:- ${quotationData.bending}`;

    sheet.getCell("D30").value =
      calculateTotalPieces(
        quotationData.materials
      );

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
          Number(item.piece) || "";

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
      templateType = "excel",
    } = {}
  ) => {

    const workbook =
      new ExcelJS.Workbook();

    const isPackaged =
      !!process.resourcesPath;

    const templateFile =
      templateType === "pdf"
        ? "quotation_pdf_template.xlsx"
        : "quotation_template.xlsx";

    const templatePath =
      isPackaged
        ? path.join(
          process.resourcesPath,
          "back",
          "template",
          templateFile
        )
        : path.join(
          process.cwd(),
          "template",
          templateFile
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
        quotationData,
        templateType
      );
    }
    else if (
      selectedSheetName ===
      "Sheet2"
    ) {

      fillMediumQuotationSheet(
        sheet,
        quotationData,
        templateType
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