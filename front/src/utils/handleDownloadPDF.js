
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const handleDownloadPDF = async ({ pdfRef, data }) => {
  const originalElement = pdfRef.current;
  if (!originalElement) return;

  const element = pdfRef.current;
  const rect = element.getBoundingClientRect();

  console.log("Width:", rect.width);
  console.log("Height:", rect.height);

  const printContainer = document.createElement("div");

  // Based on your specific px dimensions:
  const containerWidth = rect.height * 2;
  const containerHeight = rect.width * 2;

  // We scale the height slightly (1.02) to perfectly fill the A4 ratio (1.41)
  const scaleHeight = 1.02;
  const scaleWidth = 1.0;

  Object.assign(printContainer.style, {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    gap: "0px",
    padding: "0px",
    width: `${containerWidth}px`,
    height: `${containerHeight}px`,
    position: "fixed",
    left: "-9999px",
    top: "0",
    backgroundColor: "#ffffff",
  });

  for (let i = 0; i < 4; i++) {
    const clone = originalElement.cloneNode(true);
    const rotationWrapper = document.createElement("div");

    Object.assign(rotationWrapper.style, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      // Adding a background color here helps if the border has rounded corners
      backgroundColor: "#ffffff",
    });

    Object.assign(clone.style, {
      transform: `rotate(-90deg) scale(${scaleHeight}, ${scaleWidth})`,
      transformOrigin: "center center",
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "5px",
      position: "static",
      flexShrink: "0",

      // Optional: If you want a slight "cut line" look, use dashed
      border: "1px dashed #9ca3af", 
      boxSizing: "border-box" // Ensures border stays inside the width/height
    });

    rotationWrapper.appendChild(clone);
    printContainer.appendChild(rotationWrapper);
  }

  document.body.appendChild(printContainer);

  try {
    const canvas = await html2canvas(printContainer, {
      scale: 2, // Increase for print sharpness
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // 210mm x 297mm is exactly 1.41 ratio. 
    // Our canvas is now also effectively 1.41 ratio.
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`Quotation_${data.cliName || "Export"}.pdf`);
  } catch (error) {
    console.error("PDF Error:", error);
  } finally {
    document.body.removeChild(printContainer);
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

        const file = new File([blob], "quotation.png", {
          type: "image/png",
        });

        resolve(file);
      }, "image/png");
    });
  } catch (err) {
    console.error("Image generation error:", err);
    return null;
  }
};