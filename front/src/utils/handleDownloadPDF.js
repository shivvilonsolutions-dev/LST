import html2canvas from "html2canvas";
import jsPDF from "jspdf";


export const handleDownloadPDF =
  async ({
    pdfRef,
    data,
    shouldDownload = false,
  }) => {
  const originalElement = pdfRef?.current;
  if (!originalElement) return null;

  try {
    const canvas = await html2canvas(originalElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // High quality JPEG
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const margin = 10;
    const printWidth = pageWidth - margin * 2; // 190mm
    const printHeight = (canvas.height * printWidth) / canvas.width;

    // Add single quotation slip at top-left
    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      margin,
      printWidth,
      printHeight
    );

    // DOWNLOAD IN BROWSER ONLY IF REQUESTED
    if (shouldDownload) {
      pdf.save(
        `Quotation_${data?.cliName || "Export"}_${data?.mobile || ""}.pdf`
      );
    }

    return pdf.output("datauristring");
  } catch (error) {
    console.error("PDF Error:", error);
    return null;
  }
};

export const generateImageFromRef = async (ref) => {
  if (!ref?.current) return null;
  try {
    const canvas = await html2canvas(ref.current, {
      useCORS: true,
      backgroundColor: "#ffffff",
      scale: 1,
    });
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], "quotation.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    });
  } catch (err) {
    console.error("Image generation error:", err);
    return null;
  }
};

/**
 * generateQuotationJpg
 *
 * Captures the quotation DOM element (QuotationPdfTemplate) as a
 * high-quality JPEG of just the single quotation, copies it to the
 * system clipboard (for Ctrl+V into WhatsApp), and returns the blob URL.
 *
 * NO local file download is triggered — the image only goes to clipboard
 * and the caller opens WhatsApp directly.
 *
 * @param {React.RefObject} pdfRef - ref attached to QuotationPdfTemplate
 * @returns {Blob|null}            - raw JPEG Blob, or null on error
 */
export const generateQuotationJpg = async (pdfRef) => {
  const el = pdfRef?.current;
  if (!el) return null;

  try {
    // Capture the element at 3× high resolution to prevent line removal on high DPI
    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const dataUrl = canvas.toDataURL("image/png");

    // Check if running inside Electron and use native clipboard API (bulletproof)
    if (window.electronAPI?.copyImageToClipboard) {
      try {
        await window.electronAPI.copyImageToClipboard(dataUrl);
      } catch (err) {
        console.error("Native clipboard write failed:", err);
      }
    } else if (navigator.clipboard && window.ClipboardItem) {
      // Fallback for standard browsers
      try {
        const pngBlob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/png")
        );
        if (pngBlob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": pngBlob }),
          ]);
        }
      } catch (err) {
        console.error("Web clipboard write failed:", err);
      }
    }

    return dataUrl;

  } catch (error) {
    console.error("JPG Generation Error:", error);
    return null;
  }
};