import React, { forwardRef } from "react";

/**
 * QuotationPdfTemplate
 *
 * Replica of the blue spreadsheet layout provided by the user.
 * Supports dynamic row sizes (small = 9 rows, mid = 13 rows, large = 26 rows).
 */
const QuotationPdfTemplate = forwardRef(({ data, size = "small" }, ref) => {
  const materials = data?.materials || [];

  // Determine row count based on print size
  let rowCount = 9;
  if (size === "mid") rowCount = 13;
  if (size === "large") rowCount = 26;

  // Always show exactly `rowCount` rows
  const rows = Array.from({ length: rowCount }, (_, index) => {
    return materials[index] || { size: "", piece: "", gauge: "" };
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

  const BLUE = "#8db4e2"; // Soft steel blue from user's uploaded image
  const BORDER_STYLE = "2px solid #000000";

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
        }}
      >
        <tbody>
          {/* Row 1: Shree (Client Name) & Deli Time Header */}
          <tr>
            <td
              colSpan={4}
              style={{
                border: BORDER_STYLE,
                backgroundColor: BLUE,
                padding: "8px 12px",
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
                padding: "8px 12px",
                textAlign: "left",
                width: "32%",
                fontSize: "18px",
                color: "#000000",
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
                padding: "8px 4px",
                color: "#000000",
              }}
            ></td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "38%",
                textAlign: "center",
                padding: "8px",
                fontSize: "20px",
                color: "#000000",
              }}
            >
              SIZE
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "12%",
                textAlign: "center",
                padding: "8px",
                fontSize: "20px",
                color: "#000000",
              }}
            >
              PC
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                width: "12%",
                textAlign: "center",
                padding: "8px",
                fontSize: "20px",
                color: "#000000",
              }}
            >
              GEJ
            </td>
            <td
              style={{
                border: BORDER_STYLE,
                padding: "8px 12px",
                textAlign: "left",
                fontSize: "16px",
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              {formatDateTime(data?.quotationDate || new Date())}
            </td>
          </tr>

          {/* Rows 3 to N (Materials 1 to rowCount) & Right side parameters */}
          {rows.map((row, i) => {
            let rightLabel = "";
            let rightVal = "";
            let isBlueBg = false;

            if (i === 0) {
              rightLabel = "MO:-";
              rightVal = data?.mobile || "";
              isBlueBg = true;
            } else if (i === 2) {
              rightLabel = "RATE B:-";
              rightVal = data?.rateB1 || "";
            } else if (i === 3) {
              rightLabel = "ADD:-";
              rightVal = data?.add || "";
              isBlueBg = true;
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

            return (
              <tr key={i} style={{ height: "42px" }}>
                <td
                  style={{
                    border: BORDER_STYLE,
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#000000",
                  }}
                >
                  {i + 1}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    padding: "6px 12px",
                    fontSize: "20px",
                    color: "#000000",
                    textAlign: "left",
                  }}
                >
                  {row.size || ""}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#000000",
                  }}
                >
                  {row.piece || ""}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#000000",
                  }}
                >
                  {row.gauge || ""}
                </td>
                <td
                  style={{
                    border: BORDER_STYLE,
                    backgroundColor: isBlueBg ? BLUE : "transparent",
                    padding: "6px 12px",
                    textAlign: "left",
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

      {/* Bottom Footer Section with clean black borders matching spreadsheet layout */}
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
            padding: "8px 0",
            borderBottom: "2px solid #000000",
            fontSize: "22px",
          }}
        >
          માપ ચેક કરી ને રજા લેવી
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "8px 0",
            fontSize: "22px",
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