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
    scale: 2,
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

  // Generate the requested number of slips
  let slipsHtml = "";
  if (size === "small") {
    slipsHtml = `
      <div class="slip"><img src="${imgDataUrl}" /></div>
      <div class="slip"><img src="${imgDataUrl}" /></div>
      <div class="slip"><img src="${imgDataUrl}" /></div>
    `;
  } else if (size === "mid") {
    slipsHtml = `
      <div class="slip"><img src="${imgDataUrl}" /></div>
      <div class="slip"><img src="${imgDataUrl}" /></div>
    `;
  } else {
    slipsHtml = `
      <div class="slip"><img src="${imgDataUrl}" /></div>
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
      height: 297mm;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* flex: 1 automatically scales the height based on number of child slips */
    .slip {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2mm 3mm;
      overflow: hidden;
      position: relative;
    }

    /* Dashed cut-line between slips */
    .slip:not(:last-child)::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 4mm;
      right: 4mm;
      border-bottom: 1.2px dashed #888;
    }

    .slip img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
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
