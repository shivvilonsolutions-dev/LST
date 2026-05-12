
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

            const topLeftWrapper = document.createElement("div");

         Object.assign(topLeftWrapper.style, {
           display: "flex",
           flexDirection: "column",
           justifyContent: "flex-start",
           alignItems: "flex-start",
           gap: "5px",
         });


         for (let i = 0; i < 3; i++) {
           const clone = originalElement.cloneNode(true);

            const inputs = clone.querySelectorAll("input");




            
  inputs.forEach((inp) => {

  const div = document.createElement("div");

  div.innerText = inp.value;
  

  Object.assign(div.style, {
    width: inp.style.width || "100%",
    maxWidth: "100%",
    flex: "1",
    minHeight: "24px",
    fontSize: "8px",
    padding: "2px 4px",
    border: "1px solid #000",
    outline: "none",
    boxShadow: "none",
    borderRadius: "0px",
    background: "#fff",

    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",

    lineHeight: "1.4",
    fontFamily: "inherit",
    boxSizing: "border-box",

    display: "flex",
    alignItems: "center",
  });

  inp.parentNode.replaceChild(div, inp);
});



const wrappers = clone.querySelectorAll(".MuiOutlinedInput-root");

wrappers.forEach((wrap) => {
  wrap.style.border = "none";
  wrap.style.outline = "none";
  wrap.style.boxShadow = "none";
  wrap.style.background = "transparent";
});

const fieldsets = clone.querySelectorAll("fieldset");

fieldsets.forEach((fs) => {
  fs.style.border = "none";
});

  const rows = clone.querySelectorAll("div");

  rows.forEach((row) => {
    row.style.gap = "2px";
  });

  const labels = clone.querySelectorAll("p, span");

  labels.forEach((label) => {
    label.style.fontSize = "10px";
  });


           Object.assign(clone.style, {
             transform: "scale(1.0)",
             transformOrigin: "top left",
             margin: "0px",
             border: "none",
           });

           topLeftWrapper.appendChild(clone);
            }

             
           printContainer.appendChild(topLeftWrapper);


           for (let i = 0; i < 3; i++) {
               const empty = document.createElement("div");
               printContainer.appendChild(empty);
             }

  document.body.appendChild(printContainer);

  try {
    const canvas = await html2canvas(printContainer, {
      scale: 4, 
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