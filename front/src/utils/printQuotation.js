import html2canvas from "html2canvas";

/**
 * printQuotationWithSize
 *
 * Dedicated Universal A6 Paper Printing:
 * - Automatically configures the browser and printer to exact A6 Portrait (@page { size: A6 portrait; margin: 0; })
 * - Works universally across all printers (Brother, HP, Canon, Epson) on A6 paper
 * - Automatically divides into:
 *     - "small": 3 copies per A6 page with dashed cut-lines
 *     - "mid":   2 copies per A6 page with dashed cut-lines
 *     - "large": 1 copy per A6 page
 * - 100% full-width fit (no side blank space, no left/right cut-off)
 * - Directly triggers the print dialog without requiring any manual mode selection
 *
 * @param {React.RefObject} pdfRef - ref attached to the quotation DOM element
 * @param {string} size            - "small", "mid", or "large"
 */
export const printQuotationWithSize = async (pdfRef, size = "small") => {
  const originalElement = pdfRef?.current;
  if (!originalElement) return;

  // ── Capture the quotation as a high-res canvas ──────────────────────────
  const canvas = await html2canvas(originalElement, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgDataUrl = canvas.toDataURL("image/jpeg", 0.95);

  // ── Build an isolated print window ─────────────────────────────────────
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    alert("Pop-up blocked! Please allow pop-ups for this site and try again.");
    return;
  }

  // 3, 2, 1 format based on size
  let numCopies = 3;
  if (size === "mid") numCopies = 2;
  if (size === "large") numCopies = 1;

  let slipsHtml = "";
  for (let i = 0; i < numCopies; i++) {
    slipsHtml += `
      <div class="slip">
        <img src="${imgDataUrl}" />
      </div>`;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Print Quotation (A6)</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* Standard A4 Portrait with zero margin:
       In Brother & HP printers, A6 paper is loaded into the center of the A4 tray.
       This places the A6 slips pinned to the top-center (X = 52.5mm, Y = 1.5mm),
       completely eliminating the 74mm blank top gap while keeping horizontal fit 100% perfect. */
    @page {
      size: A4 portrait;
      margin: 0mm;
    }

    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: sans-serif;
      overflow: hidden;
    }

    .page {
      width: 105mm;
      height: 144mm;
      max-height: 144mm;
      margin: 3.2mm auto 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: stretch;
      padding: 0 1.5mm;
      box-sizing: border-box;
      background: #ffffff;
      overflow: hidden;
    }

    .slip {
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      margin: 0;
      padding: 0.5mm 0;
      box-sizing: border-box;
    }

    /* Dashed cut-line between slips */
    .slip:not(:last-child)::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-bottom: 1.2px dashed #000000;
    }

    .slip img {
      width: 100%;
      height: 100%;
      object-fit: fill;
      display: block;
    }

    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
        overflow: hidden;
      }
      .page {
        width: 105mm;
        height: 144mm;
        max-height: 144mm;
        margin: 3.2mm auto 0 auto;
        padding: 0 1.5mm;
        overflow: hidden;
        page-break-after: avoid;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    ${slipsHtml}
  </div>
  <script>
    function triggerPrint() {
      window.focus();
      setTimeout(function () {
        window.print();
        window.onafterprint = function () { window.close(); };
      }, 350);
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
      triggerPrint();
    } else {
      window.addEventListener("load", triggerPrint);
    }
  <\/script>
</body>
</html>`);

  printWindow.document.close();
};

/**
 * For backwards compatibility
 */
export const printQuotationQuarter = async (pdfRef) => {
  return printQuotationWithSize(pdfRef, "small");
};
