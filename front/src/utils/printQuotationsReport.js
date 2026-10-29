import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Helper to format date into DD-MM-YYYY HH:mm
 */
const formatDateTime = (dateVal) => {
  if (!dateVal) return "-";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

/**
 * Builds standard HTML table for A4 Quotations report
 */
const buildReportHtml = ({ data, search, filter, selectedMonth }) => {
  const generatedAt = formatDateTime(new Date());

  let filterDesc = [];
  if (search) filterDesc.push(`Search: "${search}"`);
  if (filter && filter !== "ALL") filterDesc.push(`Status: ${filter}`);
  if (selectedMonth) {
    const m = new Date(selectedMonth);
    const monthName = m.toLocaleString("en-US", { month: "short", year: "numeric" });
    filterDesc.push(`Month: ${monthName}`);
  }
  const filterText = filterDesc.length > 0 ? filterDesc.join(" | ") : "All Quotations";

  const rowsHtml = (data || []).map((item, index) => {
    const clientName = item?.cliName || "-";
    const phone = item?.whatsapp || item?.mobile || "-";

    // All gauges / thickness
    const gauges = (item?.materials || [])
      .map((m) => m.gauge)
      .filter(Boolean);
    const gaugeText = gauges.length > 0 ? [...new Set(gauges)].join(", ") : "-";

    // Materials details (Size, Piece, Gauge)
    const materialsList = (item?.materials || [])
      .filter((m) => m.size || m.piece || m.gauge)
      .map((m) => {
        let parts = [];
        if (m.size) parts.push(m.size);
        if (m.piece) parts.push(`${m.piece} pcs`);
        if (m.gauge) parts.push(`(${m.gauge})`);
        return parts.join(" - ");
      });
    const materialsHtml = materialsList.length > 0 ? materialsList.join("<br/>") : "-";

    const dateStr = formatDateTime(item?.quotationDate);
    const status = item?.status || "PENDING";
    const isConfirm = status === "CONFIRM";
    const statusBadge = `<span class="badge ${isConfirm ? "badge-confirm" : "badge-pending"}">${status}</span>`;

    // Extra rates if available
    let rates = [];
    if (item?.rateB1) rates.push(`B1: ${item.rateB1}`);
    if (item?.rateB2) rates.push(`B2: ${item.rateB2}`);
    if (item?.add) rates.push(`Add: ${item.add}`);
    if (item?.bending) rates.push(`BE: ${item.bending}`);
    if (item?.laserCutting) rates.push(`LC: ${item.laserCutting}`);
    const ratesText = rates.length > 0 ? rates.join(" | ") : "-";

    return `
      <tr>
        <td style="text-align: center; font-weight: bold;">${index + 1}</td>
        <td style="font-weight: bold; color: #0f172a;">${clientName}</td>
        <td style="font-weight: 600; color: #1e3a8a; text-align: center;">${gaugeText}</td>
        <td>${materialsHtml}</td>
        <td>${phone}</td>
        <td style="text-align: center;">${dateStr}</td>
        <td style="text-align: center;">${statusBadge}</td>
        <td style="font-size: 11px; color: #475569;">${ratesText}</td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Quotations Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page {
      size: A4 portrait;
      margin: 10mm 8mm 12mm 8mm;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      padding: 10px;
    }

    .report-header {
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .company-title {
      font-size: 22px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.5px;
    }

    .report-subtitle {
      font-size: 13px;
      color: #475569;
      margin-top: 2px;
    }

    .report-meta {
      text-align: right;
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
    }

    .report-meta strong {
      color: #1e293b;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    thead {
      display: table-header-group;
    }

    th {
      background: #1e3a8a;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 7px 6px;
      border: 1px solid #1e3a8a;
      font-size: 12px;
    }

    td {
      padding: 6px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
      line-height: 1.35;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .badge-pending {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }

    .badge-confirm {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    .report-footer {
      margin-top: 14px;
      padding-top: 6px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }

    @media print {
      body {
        padding: 0;
      }
      .badge {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      th {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      tr:nth-child(even) td {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <div>
      <div class="company-title">LST - Quotations Report</div>
      <div class="report-subtitle">${filterText}</div>
    </div>
    <div class="report-meta">
      <div>Total Records: <strong>${data?.length || 0}</strong></div>
      <div>Generated: <strong>${generatedAt}</strong></div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 4%; text-align: center;">#</th>
        <th style="width: 22%;">Client Name</th>
        <th style="width: 13%; text-align: center;">Gauge / Thick</th>
        <th style="width: 23%;">Materials (Size - Pcs)</th>
        <th style="width: 14%;">WhatsApp / Mobile</th>
        <th style="width: 12%; text-align: center;">Date</th>
        <th style="width: 9%; text-align: center;">Status</th>
        <th style="width: 13%;">Rates / Extra</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || '<tr><td colspan="8" style="text-align: center; padding: 20px;">No quotations found</td></tr>'}
    </tbody>
  </table>

  <div class="report-footer">
    <div>LST Quotation Desktop Application</div>
    <div>Page 1 of 1</div>
  </div>
</body>
</html>`;
};

/**
 * Open print window for the filtered quotations list in standard A4 format
 */
export const printQuotationsReport = ({ data, search, filter, selectedMonth }) => {
  if (!data || data.length === 0) {
    alert("No quotations available to print!");
    return;
  }

  const printWindow = window.open("", "_blank", "width=1000,height=900");
  if (!printWindow) {
    alert("Pop-up blocked! Please allow pop-ups for this site and try again.");
    return;
  }

  const html = buildReportHtml({ data, search, filter, selectedMonth });
  printWindow.document.write(html);
  printWindow.document.write(`
    <script>
      function triggerPrint() {
        window.focus();
        setTimeout(function() {
          window.print();
        }, 300);
      }
      if (document.readyState === "complete" || document.readyState === "interactive") {
        triggerPrint();
      } else {
        window.addEventListener("load", triggerPrint);
      }
    <\/script>
  `);
  printWindow.document.close();
};

/**
 * Downloads a high-quality A4 PDF of the filtered quotations list
 */
export const downloadQuotationsReportPdf = async ({ data, search, filter, selectedMonth }) => {
  if (!data || data.length === 0) {
    alert("No quotations available to download!");
    return;
  }

  // Create off-screen container for rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "1000px";
  container.style.background = "#ffffff";
  container.innerHTML = buildReportHtml({ data, search, filter, selectedMonth });
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 8;
    const printWidth = pageWidth - margin * 2; // 194mm
    const imgHeightMm = (canvas.height * printWidth) / canvas.width;
    const contentHeightPerPage = pageHeight - margin * 2; // 281mm

    let heightLeft = imgHeightMm;
    let position = margin;

    // First page
    pdf.addImage(imgData, "JPEG", margin, position, printWidth, imgHeightMm);
    heightLeft -= contentHeightPerPage;

    // Additional pages if table is long
    while (heightLeft > 0) {
      position -= contentHeightPerPage;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, position, printWidth, imgHeightMm);
      heightLeft -= contentHeightPerPage;
    }

    const searchTag = search ? `_${search.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    const fileName = `Quotations_Report${searchTag}_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    alert("Failed to generate PDF report: " + err.message);
  } finally {
    document.body.removeChild(container);
  }
};
