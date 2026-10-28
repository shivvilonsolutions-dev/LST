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

  // Row count per size
  let rowCount = 6;
  if (size === "mid") rowCount = 13;
  if (size === "large") rowCount = 26;
  if (size === "small") rowCount = 6;

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
  const BORDER_STYLE = "1.5px solid #000000";

  const pcHeader = size === "small" ? "PIC" : "PC";
  const gejHeader = size === "mid" ? "GUJ" : "GEJ";

  return (
    <div
      ref={ref}
      style={{
        width: "850px",
        background: "#ffffff",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        padding: "2px 3px",
        margin: "0",
        boxSizing: "border-box",
        color: "#000000",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "2px solid #000000",
          fontSize: "24px",
          fontWeight: "900",
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
                padding: "6px 8px",
                textAlign: "left",
                fontSize: "32px",
                fontWeight: "900",
                color: "#000000",
              }}
            >
              SHREE:- {data?.cliName || ""}
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                padding: "6px 8px",
                textAlign: "left",
                width: "28%",
                fontSize: "26px",
                fontWeight: "900",
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
                width: "4%",
                textAlign: "center",
                padding: "4px 2px",
                fontSize: "22px",
                fontWeight: "900",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            ></td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "46%",
                textAlign: "center",
                padding: "4px 6px",
                fontSize: "28px",
                fontWeight: "900",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            >
              SIZE
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "11%",
                textAlign: "center",
                padding: "4px 3px",
                fontSize: "28px",
                fontWeight: "900",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            >
              {pcHeader}
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "11%",
                textAlign: "center",
                padding: "4px 3px",
                fontSize: "28px",
                fontWeight: "900",
                color: "#000000",
                backgroundColor: "#ffffff",
              }}
            >
              {gejHeader}
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                padding: "4px 6px",
                textAlign: "left",
                fontSize: "22px",
                color: "#000000",
                fontWeight: "900",
                backgroundColor: "#ffffff",
                whiteSpace: "nowrap",
              }}
            >
              {formatDateTime(data?.quotationDate || new Date())}
            </td>
          </tr>

          {/* Material rows */}
          {(() => {
            const whatsappNumber = data?.whatsapp || data?.mobile || "";
            const rawDigits = String(whatsappNumber).replace(/\D/g, "");
            const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

            return rows.map((row, i) => {
              let rightLabel = "";
              let rightVal = "";
              let isThemeBg = false;

              if (size === "small") {
                if (i === 0) {
                  rightLabel = "WHATSAPP:-";
                  rightVal = whatsappNumber;
                  isThemeBg = true;
                } else if (i === 1) {
                  rightLabel = "RATE B1:-";
                  rightVal = data?.rateB1 || "";
                } else if (i === 2) {
                  rightLabel = "RATE B2:-";
                  rightVal = data?.rateB2 || "";
                } else if (i === 3) {
                  rightLabel = "ADD:-";
                  rightVal = data?.add || "";
                  isThemeBg = true;
                } else if (i === 4) {
                  rightLabel = "BENDING:-";
                  rightVal = data?.bending || "";
                } else if (i === 5) {
                  rightLabel = "LASER CUTTING:-";
                  rightVal = data?.laserCutting || "";
                }
              } else {
                // mid (13 rows) & large (26 rows)
                if (i === 0) {
                  rightLabel = "WHATSAPP:-";
                  rightVal = whatsappNumber;
                  isThemeBg = true;
                } else if (i === 1) {
                  rightLabel = "RATE B1:-";
                  rightVal = data?.rateB1 || "";
                } else if (i === 2) {
                  rightLabel = "RATE B2:-";
                  rightVal = data?.rateB2 || "";
                } else if (i === 3) {
                  rightLabel = "ADD:-";
                  rightVal = data?.add || "";
                  isThemeBg = true;
                } else if (i === 4) {
                  rightLabel = "BENDING:-";
                  rightVal = data?.bending || "";
                } else if (i === 5) {
                  rightLabel = "LASER CUTTING:-";
                  rightVal = data?.laserCutting || "";
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
              <tr key={i} style={{ height: "44px" }}>
                <td
                  style={{
                    border: BORDER_STYLE,
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "900",
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    padding: "3px 2px",
                  }}
                >
                  {i + 1}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    padding: "3px 6px",
                    fontSize: "28px",
                    fontWeight: "900",
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
                    fontSize: "28px",
                    fontWeight: "900",
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    padding: "3px 3px",
                  }}
                >
                  {row.piece || ""}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    textAlign: "center",
                    fontSize: "28px",
                    fontWeight: "900",
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    padding: "3px 3px",
                  }}
                >
                  {row.gauge || ""}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    backgroundColor: isThemeBg ? THEME_COLOR : "#ffffff",
                    padding: "3px 6px",
                    textAlign: rightLabel && (rightLabel === "9925018479" || rightLabel === "9925018420") ? "right" : "left",
                    fontSize: "24px",
                    fontWeight: "900",
                    color: "#000000",
                  }}
                >
                  {i === 0 && cleanPhone ? (
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#000000", textDecoration: "none", fontWeight: "900" }}
                    >
                      {rightLabel} {rightVal}
                    </a>
                  ) : (
                    rightLabel ? `${rightLabel} ${rightVal}` : ""
                  )}
                </td>
              </tr>
            );
          });
        })()}
        </tbody>
      </table>

      {/* Bottom Gujarati Footer */}
      <div
        style={{
          width: "100%",
          borderLeft: "2px solid #000000",
          borderRight: "2px solid #000000",
          borderBottom: "2px solid #000000",
          backgroundColor: "#ffffff",
          boxSizing: "border-box",
          fontWeight: "900",
          color: "#000000",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "5px 0",
            borderBottom: "1.5px solid #000000",
            fontSize: "26px",
            fontWeight: "900",
          }}
        >
          માપ ચેક કરી ને રજા લેવી
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "5px 0",
            fontSize: "26px",
            fontWeight: "900",
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
