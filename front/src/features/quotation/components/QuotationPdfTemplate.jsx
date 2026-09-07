import React, { forwardRef } from "react";

const EMPTY_ROW = { size: "", piece: "", gauge: "" };

/**
 * QuotationPdfTemplate
 *
 * Replica of the quotation spreadsheet layout.
 * Print/Share sizes:
 * - "small": 6 rows, Green theme (#92d050), headers PIC / GEJ
 * - "mid":   13 rows, Blue theme (#8db4e2), headers PC / GUJ
 * - "large": 26 rows, Blue theme (#8db4e2), headers PC / GEJ
 */
const QuotationPdfTemplate = forwardRef(({ data, size = "small" }, ref) => {
  const materials = data?.materials || [];

  let rowCount = 6;
  if (size === "mid") rowCount = 13;
  if (size === "large") rowCount = 26;

  rowCount = Math.max(rowCount, materials.length);
  const rows = Array.from({ length: rowCount }, (_, index) => {
    return materials[index] || EMPTY_ROW;
  });

  // Date formatting helper to match DD-MM-YYYY HH:mm
  const formatDateTime = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // Color theme: Small is Green (#92d050), Mid & Large are Blue (#8db4e2)
  const THEME_COLOR = size === "small" ? "#92d050" : "#8db4e2";
  const BORDER_STYLE = "2px solid #000000";

  const pcHeader = size === "small" ? "PIC" : "PC";
  const gejHeader = size === "mid" ? "GUJ" : "GEJ";

  return (
    <div
      ref={ref}
      style={{
        width: 794,
        background: "#ffffff",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        padding: "10px",
        boxSizing: "border-box",
        color: "#000000",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "3px solid #000000",
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: "#ffffff",
        }}
      >
        <tbody>
          {/* Row 1: Shree (Client Name) & Deli Time Header */}
          <tr>
            <td
              colSpan={4}
              style={{
                border: BORDER_STYLE,
                backgroundColor: THEME_COLOR,
                padding: "6px 12px",
                textAlign: "left",
                fontSize: "22px",
                color: "#000000",
              }}
            >
              SHREE:- {data?.cliName || ""}
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                padding: "6px 12px",
                textAlign: "left",
                width: "32%",
                fontSize: "18px",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            >
              DELI TIME:-
            </td>
          </tr>

          {/* Row 2: Sub-headers (SIZE, PC, GEJ) & Formatted Date */}
          <tr>
            <td
              style={{
                border: BORDER_STYLE,
                width: "6%",
                textAlign: "center",
                padding: "6px 4px",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            ></td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "38%",
                textAlign: "center",
                padding: "6px",
                fontSize: "20px",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            >
              SIZE
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "12%",
                textAlign: "center",
                padding: "6px",
                fontSize: "20px",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            >
              {pcHeader}
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "12%",
                textAlign: "center",
                padding: "6px",
                fontSize: "20px",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            >
              {gejHeader}
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                padding: "6px 12px",
                textAlign: "left",
                fontSize: "16px",
                color: "#000000",
                fontWeight: "bold",
                backgroundColor: "#ffffff",
              }}
            >
              {formatDateTime(data?.quotationDate || new Date())}
            </td>
          </tr>

          {/* Material rows */}
          {rows.map((row, i) => {
            let rightLabel = "";
            let rightVal = "";
            let isThemeBg = false;

            if (size === "small") {
              if (i === 0) {
                rightLabel = "MO:-";
                rightVal = data?.mobile || "";
                isThemeBg = true;
              } else if (i === 1) {
                rightLabel = "RATE B:-";
                rightVal = data?.rateB1 || "";
              } else if (i === 2) {
                rightLabel = "RATE B:-";
                rightVal = data?.rateB2 || "";
              } else if (i === 3) {
                rightLabel = "ADD:-";
                rightVal = data?.add || "";
                isThemeBg = true;
              } else if (i === 4) {
                rightLabel = "BENDING:-";
                rightVal = data?.bending || "";
              } else if (i === 5) {
                rightLabel = "MO:-9925018479";
                rightVal = "";
              }
            } else if (size === "mid") {
              if (i === 0) {
                rightLabel = "MO:-";
                rightVal = data?.mobile || "";
                isThemeBg = true;
              } else if (i === 2) {
                rightLabel = "RATE B:-";
                rightVal = data?.rateB1 || "";
              } else if (i === 3) {
                rightLabel = "ADD:-";
                rightVal = data?.add || "";
                isThemeBg = true;
              } else if (i === 4) {
                rightLabel = "CUTTING:-";
                rightVal = data?.bending || "";
              } else if (i === 6) {
                rightLabel = "MO:-9925018479";
                rightVal = "";
              } else if (i === 7) {
                rightLabel = "9925018479";
                rightVal = "";
              } else if (i === 8) {
                rightLabel = "9925018420";
                rightVal = "";
              }
            } else {
              // Large (26 rows)
              if (i === 0) {
                rightLabel = "MO:-";
                rightVal = data?.mobile || "";
                isThemeBg = true;
              } else if (i === 2) {
                rightLabel = "RATE B:-";
                rightVal = data?.rateB1 || "";
              } else if (i === 3) {
                rightLabel = "ADD:-";
                rightVal = data?.add || "";
                isThemeBg = true;
              } else if (i === 4) {
                rightLabel = "BENDING:-";
                rightVal = data?.bending || "";
              } else if (i === 6) {
                rightLabel = "MO";
                rightVal = "";
              } else if (i === 7) {
                rightLabel = "9925018479";
                rightVal = "";
              } else if (i === 8) {
                rightLabel = "9925018420";
                rightVal = "";
              }
            }

            return (
              <tr key={i} style={{ height: "38px" }}>
                <td
                  style={{
                    border: BORDER_STYLE,
                    textAlign: "center",
                    fontSize: "18px",
                    color: "#000000",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {i + 1}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    padding: "4px 8px",
                    fontSize: "18px",
                    color: "#000000",
                    textAlign: "left",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {row.size || ""}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    textAlign: "center",
                    fontSize: "18px",
                    color: "#000000",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {row.piece || ""}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    textAlign: "center",
                    fontSize: "18px",
                    color: "#000000",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {row.gauge || ""}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    backgroundColor: isThemeBg ? THEME_COLOR : "#ffffff",
                    padding: "4px 8px",
                    textAlign: rightLabel && (rightLabel === "9925018479" || rightLabel === "9925018420") ? "right" : "left",
                    fontSize: "18px",
                    color: "#000000",
                  }}
                >
                  {rightLabel} {rightVal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Bottom Gujarati Footer */}
      <div
        style={{
          width: "100%",
          borderLeft: "3px solid #000000",
          borderRight: "3px solid #000000",
          borderBottom: "3px solid #000000",
          backgroundColor: "#ffffff",
          boxSizing: "border-box",
          fontWeight: "bold",
          color: "#000000",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "6px 0",
            borderBottom: "2px solid #000000",
            fontSize: "20px",
          }}
        >
          માપ ચેક કરી ને રજા લેવી
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "6px 0",
            fontSize: "20px",
          }}
        >
          કટિંગ કરેલ માલ પાછો રાખવા માં નહિ આવે
        </div>
      </div>
    </div>
  );
});

QuotationPdfTemplate.displayName = "QuotationPdfTemplate";

export default QuotationPdfTemplate;