import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const handleDownloadPDF = async ({ pdfRef, data }) => {
  const originalElement = pdfRef.current;
  if (!originalElement) return;

  // A4 at 96dpi
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const PADDING_X = 30;   // ← left & right
  const PADDING_Y = 40; 
  const DIVIDER_HEIGHT = 14; // 2 dividers × 7px

  const availableWidth = A4_WIDTH_PX - PADDING_X * 2;
  const availableHeight = A4_HEIGHT_PX - PADDING_Y * 2 - DIVIDER_HEIGHT;
  const slotHeight = Math.floor(availableHeight / 3);

  // Measure original BEFORE cloning
  const originalRect = originalElement.getBoundingClientRect();
  const originalWidth = originalRect.width;
  const originalHeight = originalRect.height;

  const scaleX = availableWidth / originalWidth;
  const scaleY = slotHeight / originalHeight;

  console.log("originalWidth:", originalWidth, "originalHeight:", originalHeight);
  console.log("scaleX:", scaleX, "scaleY:", scaleY);
  console.log("slotHeight:", slotHeight);

  const printContainer = document.createElement("div");
  Object.assign(printContainer.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: `${PADDING_Y}px ${PADDING_X}px`,
    width: `${A4_WIDTH_PX}px`,
    height: `${A4_HEIGHT_PX}px`,
    position: "fixed",
    left: "-9999px",
    top: "0",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    overflow: "hidden",
  });

  const prepareClone = (original) => {
    const clone = original.cloneNode(true);

    // Replace inputs with styled divs
    clone.querySelectorAll("input").forEach((inp) => {
      const div = document.createElement("div");
      div.innerText = inp.value;
      Object.assign(div.style, {
        display: "inline-flex",
        alignItems: "center",
        width: inp.offsetWidth ? `${inp.offsetWidth}px` : "100%",
        minHeight: "20px",
        fontSize: "10px",
        padding: "2px 4px",
        border: "1px solid #000",
        borderRadius: "0",
        background: "#fff",
        whiteSpace: "normal",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        lineHeight: "1.4",
        fontFamily: "inherit",
        boxSizing: "border-box",
      });
      inp.parentNode.replaceChild(div, inp);
    });

    // Strip MUI borders
    clone.querySelectorAll(".MuiOutlinedInput-root").forEach((el) => {
      el.style.border = "none";
      el.style.outline = "none";
      el.style.boxShadow = "none";
      el.style.background = "transparent";
    });
    clone.querySelectorAll("fieldset").forEach((el) => {
      el.style.border = "none";
    });

    // Fix font sizes
    clone.querySelectorAll("p, span, th, td, label, div").forEach((el) => {
      el.style.fontSize = "10px";
    });

    // ✅ KEY FIX: use scaleX and scaleY independently
    // This stretches the clone to fill exactly the available slot
    // without leaving blank space on right or between rows
    Object.assign(clone.style, {
      width: `${originalWidth}px`,        // keep original width
      height: `${originalHeight}px`,      // keep original height
      transform: `scale(${scaleX}, ${scaleY})`,  // stretch both axes independently
      transformOrigin: "top left",
      display: "block",
      margin: "0",
      padding: "0",
      border: "none",
      flexShrink: "0",
    });

    // Wrapper must be exactly slot size so the scaled clone
    // doesn't push other elements down (transform doesn't affect layout flow)
    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      width: `${availableWidth}px`,
      height: `${slotHeight}px`,
      overflow: "hidden",
      flexShrink: "0",
      position: "relative",
    });

    wrapper.appendChild(clone);
    return wrapper;
  };

  for (let i = 0; i < 3; i++) {
    const wrapper = prepareClone(originalElement);
    printContainer.appendChild(wrapper);

    if (i < 2) {
      const divider = document.createElement("div");
      Object.assign(divider.style, {
        width: `${availableWidth}px`,
        height: "0",
        borderTop: "2px dotted #666",
        margin: "6px 0",
        flexShrink: "0",
      });
      printContainer.appendChild(divider);
    }
  }

  document.body.appendChild(printContainer);

  try {
    const canvas = await html2canvas(printContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
    });

    // JPEG keeps file size small (1-3MB vs 120MB with PNG + scale:4)
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
    pdf.save(`Quotation_${data.cliName || "Export"}_${data.mobile}.pdf`);
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
        const file = new File([blob], "quotation.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    });
  } catch (err) {
    console.error("Image generation error:", err);
    return null;
  }
};