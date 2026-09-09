import html2canvas from "html2canvas";

/**
 * printQuotationWithSize
 *
 * Renders the quotation element as a high-res canvas image and opens a
 * browser print dialog with the requested number of copies on a single A4 page:
 * - "small": 3 copies per page (height split in 3)
 * - "mid": 2 copies per page (height split in 2)
 * - "large": 1 copy per page (full height)
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
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("Pop-up blocked! Please allow pop-ups for this site and try again.");
    return;
  }

  // Generate the requested number of slips (top-left 1/4th A4 width = 105mm)
  let slipsHtml = "";
  if (size === "small") {
    // Phase 1: 3 slips on A4 page (top-left aligned, width 105mm, height 92mm each)
    slipsHtml = `
      <div class="slip" style="width: 105mm; height: 92mm;"><img src="${imgDataUrl}" /></div>
      <div class="slip" style="width: 105mm; height: 92mm;"><img src="${imgDataUrl}" /></div>
      <div class="slip" style="width: 105mm; height: 92mm;"><img src="${imgDataUrl}" /></div>
    `;
  } else if (size === "mid") {
    // Phase 2: 2 slips on A4 page (top-left aligned, width 105mm, height 140mm each)
    slipsHtml = `
      <div class="slip" style="width: 105mm; height: 140mm;"><img src="${imgDataUrl}" /></div>
      <div class="slip" style="width: 105mm; height: 140mm;"><img src="${imgDataUrl}" /></div>
    `;
  } else {
    // Phase 3: 1 slip on A4 page (top-left aligned, width 105mm, height 280mm)
    slipsHtml = `
      <div class="slip" style="width: 105mm; height: 280mm;"><img src="${imgDataUrl}" /></div>
    `;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Print Quotation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page {
      size: A4 portrait;
      margin: 4mm;
    }

    body {
      width: 210mm;
      font-family: sans-serif;
      background: #fff;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      overflow: hidden;
    }

    /* 1/4th A4 width (105mm) aligned at top-left */
    .slip {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 1mm 0;
      margin-bottom: 2mm;
      overflow: hidden;
      position: relative;
    }

    /* Dashed cut-line between slips */
    .slip:not(:last-child)::after {
      content: "";
      position: absolute;
      bottom: -1mm;
      left: 0;
      width: 105mm;
      border-bottom: 1.2px dashed #888;
    }

    .slip img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: fill;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page">
    ${slipsHtml}
  </div>
  <script>
    window.onload = function () {
      setTimeout(function () {
        window.print();
        window.onafterprint = function () { window.close(); };
      }, 400);
    };
  <\/script>
</body>
</html>`);

  printWindow.document.close();
};

/**
 * For backwards compatibility
 */
export const printQuotationQuarter = async (pdfRef) => {
  return printQuotationWithSize(pdfRef, "mid");
};
