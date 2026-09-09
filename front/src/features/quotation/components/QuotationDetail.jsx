import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";

import { downloadQuotationPdf, downloadQuotationExcel, generateWhatsappPdf } from "../../../api/quotationApi";
import { useParams, useNavigate } from "react-router-dom";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import { useLocation } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import PageLoader from "../../../components/ui/PageLoader"
import formatDate from "../../../utils/formatDate"
import Popup from "../../../components/ui/Popup"
import { generateQuotationJpg } from "../../../utils/handleDownloadPDF";
import { printQuotationWithSize } from "../../../utils/printQuotation";
import QuotationPdfTemplate from "./QuotationPdfTemplate";



const QuotationDetail = () => {
  const location = useLocation();
  const {
    quotations,
    handleUpdateQuotation,
  } = useContext(QuotationContext);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading,
    setIsDownloading] =
    useState(false);
  const [
    isDownloadingExcel,
    setIsDownloadingExcel
  ] = useState(false);
  const [
    isWhatsappLoading,
    setIsWhatsappLoading
  ] = useState(false);
  const [warningPopup, setWarningPopup] = useState({
    open: false,
    message: "",
  });
  const [success, setSuccess] = useState({
    open: false,
    message: "",
  });
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSize, setPrintSize] = useState("small");
  const pdfRef = useRef(null);
  const navi = useNavigate();

  const quotation =
    quotations.find(
      (q) =>
        String(q.quotationNo) === String(id)
    );

  const [editData, setEditData] = useState(quotation || null);
  useEffect(() => {
    if (quotation) {
      setEditData(quotation);
    }
  }, [quotation]);

  if (!editData) {
    return <PageLoader />;
  }

  const displayDate =
    formatDate(
      editData?.quotationDate
    );

  const totalPieces =
    editData.materials.reduce(
      (sum, row) =>
        sum +
        (
          parseInt(
            row.piece || 0,
            10
          ) || 0
        ),
      0
    );

  // Helper: Get only filled quotation rows
  const getFilledRows = () => {
    return editData.materials.filter(row => 
      String(row?.size || "").trim() || 
      String(row?.piece || "").trim() || 
      String(row?.gauge || "").trim()
    );
  };

  // Helper: Automatically select print size based on TOTAL rows (not just filled)
  // Phase 1: <=6 total rows  -> "small"  -> 3 copies on A4
  // Phase 2: 7..13 total rows -> "mid"    -> 2 copies on A4
  // Phase 3: >13 total rows   -> "large"  -> 1 copy  on A4
  const getAutoPrintSize = () => {
    const totalRows = editData.materials.length;
    if (totalRows <= 6) return "small";
    if (totalRows <= 13) return "mid";
    return "large";
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMaterialChange = (index, field, value) => {
    const updated = [...editData.materials];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setEditData({
      ...editData,
      materials: updated,
    });
  };

  const handleSave = async () => {

    const response =
      await handleUpdateQuotation(
        quotation.quotationNo,
        editData
      );

    if (response.success) {

      setIsEditing(false);
    }
  };

  const handlePdfFile =
    async () => {

      try {

        setIsDownloading(
          true
        );

        const response =
          await downloadQuotationPdf(
            editData.quotationNo
          );


        if (!response.success) {

          setWarningPopup({

            open: true,

            message:
              response.message,
          });

          return;
        }
        setSuccess({

          open: true,

          message:
            `PDF generated successfully.\n\n\nLocation:${response.pdfPath}`,
        });
      }

      finally {

        setIsDownloading(
          false
        );
      }
    }

  const handleExcelFile =
    async () => {

      try {

        setIsDownloadingExcel(
          true
        );

        const response =
          await downloadQuotationExcel(
            editData.quotationNo
          );

        if (!response.success) {

          setWarningPopup({
            open: true,
            message:
              response.message,
          });

          return;
        }

        setSuccess({

          open: true,

          message:
            `Excel generated successfully.\n\n\nLocation: ${response.excelPath}`,
        });

      }
      finally {

        setIsDownloadingExcel(
          false
        );
      }
    }

  const handleWhatsApp = async () => {
    try {
      if (!editData?.whatsapp) {
        setWarningPopup({
          open: true,
          message: "Please add WhatsApp number",
        });
        return;
      }

      setIsWhatsappLoading(true);
      const autoSize = getAutoPrintSize();
      setPrintSize(autoSize);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // ── STEP 1: Generate JPG from hidden QuotationPdfTemplate ──────────
      const dataUrl = await generateQuotationJpg(pdfRef);

      if (!dataUrl) {
        setWarningPopup({
          open: true,
          message: "Could not generate quotation image. Please try again.",
        });
        return;
      }

      // ── STEP 2: Build WhatsApp phone number (Image only, no text parameter) ──
      let phone = editData.whatsapp.toString().replace(/\D/g, "");
      if (phone.startsWith("0")) {
        phone = phone.substring(1);
      }
      if (phone.length === 10) {
        phone = "91" + phone;
      }

      const whatsappUrl = `https://web.whatsapp.com/send?phone=${phone}`;

      // ── STEP 3: Auto-send image if in Electron, or copy to clipboard + open WhatsApp ──
      if (window.electronAPI?.sendWhatsAppImage) {
        await window.electronAPI.sendWhatsAppImage(dataUrl, whatsappUrl);
        setSuccess({
          open: true,
          message: "🚀 WhatsApp Image Auto-Send Initiated!\n\nWhatsApp Web is opening. The quotation spreadsheet image has been copied to your clipboard.\n\n👉 Click inside the WhatsApp chat box and press CTRL + V (Paste) to send the quotation image.",
        });
      } else {
        window.open(whatsappUrl, "WhatsAppWebWindow");
        setSuccess({
          open: true,
          message: "📋 JPG Quotation Image Copied to Clipboard!\n\nWhatsApp Web is opening in your browser.\n\n👉 Please click inside the WhatsApp chat box and press CTRL + V (Paste) to send the image.",
        });
      }

    } finally {
      setIsWhatsappLoading(false);
    }
  };


  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const autoSize = getAutoPrintSize();
      setPrintSize(autoSize);
      // Wait for react rerender state cycle
      await new Promise((resolve) => setTimeout(resolve, 200));
      await printQuotationWithSize(pdfRef, autoSize);
    } finally {
      setIsPrinting(false);
    }
  };



  const renderCell = (field, index) => {
    const value = editData.materials[index][field];

    return (
      <TableCell sx={{ p: "3px" }}>
        <Input
          inpValue={value}
          readOnly={!isEditing}
          onChange={(e) =>
            handleMaterialChange(index, field, e.target.value)
          }
        />
      </TableCell>
    );
  };

  if (!quotation || !editData) {
    return <PageLoader />;
  }

  if (!quotation) return <Box p={3}>Quotation Not Found</Box>;

  return (

    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid gray.300",
        borderRadius: 1,
        bgcolor: "white",
      }}
    >

      <Box>

        {/* Top Buttons (MATCHED) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            pb: 2,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          {/* LEFT */}
          <Button
            btnName="← Back"
            btnColor="gray"
            txtCol="black"
            onClick={() => navi(location.state?.from || "/quotations")}
          />

          {/* RIGHT */}
          <Stack direction="row" spacing={1.5}>

            {/* Print Button — Automatic size selection */}
            <Button
              btnName={isPrinting ? "Printing..." : "🖨 Print"}
              btnColor="#7c3aed"
              disabled={isPrinting}
              onClick={handlePrint}
            />

            {/* Whatsapp Button — sends JPG image */}
            <Button
              btnName={
                isWhatsappLoading
                  ? "Generating Image..."
                  : "📷 WhatsApp (JPG)"
              }
              btnColor="green"
              disabled={isWhatsappLoading}
              onClick={handleWhatsApp}
            />

            {/* Excel Button */}
            <Button
              btnName={
                isDownloadingExcel
                  ? "Generating Excel..."
                  : "Save Excel"
              }
              btnColor="primary.main"
              onClick={handleExcelFile}
            />

            {/* PDF Button */}
            <Button
              btnName={
                isDownloading
                  ? "Generating PDF..."
                  : "Save PDF"
              }
              btnColor="red"
              onClick={handlePdfFile}
            />

            {!isEditing ? (
              <Button btnName="Click to Edit" btnColor="secondary.main" onClick={() => { console.log("Before clicking the Edit button: ", isEditing); setIsEditing(true) }} />
            ) : (
              <Button btnName="Save" btnColor="green" onClick={handleSave} />
            )}

            <Button
              btnName="Close"
              btnColor="gray"
              txtCol="black"
              onClick={() => navi(location.state?.from || "/quotations")}
            />

          </Stack>

        </Box>


        {/* MAIN CONTAINER (MATCHED) */}
        <Box>

          {/* Client + Date (MATCHED) */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              mb: 2,
              justifyContent: "specify-around",
            }}
          >
            <Typography sx={{ minWidth: 95 }}> Client Name: </Typography>
            <Input
              inpName="cliName"
              inpValue={editData.cliName}
              readOnly={!isEditing}
              onChange={handleChange}
            />

            <Typography>Date:</Typography>
            <Input
              inpValue={displayDate}
              readOnly
            />
          </Box>

          {/* MAIN SECTION */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mt: 3,
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            {/* TABLE (MATCHED STYLE) */}
            <Box sx={{ flex: 1 }}>
              <Table
                sx={{
                  width: "100%",
                  tableLayout: "fixed",
                  "& th, & td": {
                    padding: "3px",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "5%" }}>No.</TableCell>
                    <TableCell sx={{ width: "55%" }}>Size</TableCell>
                    <TableCell sx={{ width: "15%" }}>Peice</TableCell>
                    <TableCell sx={{ width: "15%" }}>Gauge</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {editData.materials.map((_, i) => (
                    <TableRow key={i}>

                      {/* Index */}
                      <TableCell sx={{ p: "3px" }}>{i + 1}</TableCell>

                      {/* Reusable Cells */}
                      {renderCell("size", i)}
                      {renderCell("piece", i)}
                      {renderCell("gauge", i)}

                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </Box>

            {/* RIGHT SECTION (MATCHED) */}
            <Box
              sx={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>Mobile No.:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="mobile"
                    inpValue={editData.mobile}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>WhatsApp No.:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="whatsapp"
                    inpValue={editData.whatsapp}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Box>
              </Box>


              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>Rate B1:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="rateB1"
                    inpValue={editData.rateB1}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>Rate B2:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="rateB2"
                    inpValue={editData.rateB2}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>Bending:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="bending"
                    inpValue={editData.bending}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Box>
              </Box>


              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>Laser Cutting:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="laserCutting"
                    inpValue={editData.laserCutting}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>Add:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="add"
                    inpValue={editData.add}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>Total Pieces:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="totalPieces"
                    inpValue={totalPieces}
                    readOnly={!isEditing}
                  />
                </Box>
              </Box>

            </Box>
          </Box>
        </Box>

      </Box>

      {/* ── Hidden quotation template used by Print & WhatsApp JPG ─────── */}
      <Box
        sx={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <QuotationPdfTemplate ref={pdfRef} size={printSize} data={editData} />
      </Box>

      <Popup
        isOpen={
          warningPopup.open
        }

        title="Requirement"

        message={
          warningPopup.message
        }

        onConfirm={() =>
          setWarningPopup({

            open: false,

            message: "",
          })
        }

        onCancel={() =>
          setWarningPopup({

            open: false,

            message: "",
          })
        }
      />

      <Popup
        isOpen={
          success.open
        }

        title="File saved successfully!"

        message={
          success.message
        }

        onConfirm={() => {


          setSuccess({

            open: false,

            message: "",

            filePath: "",
          });
        }}

        onCancel={() =>
          setSuccess({

            open: false,

            message: "",

            filepath: "",
          })
        }
      />

    </Paper>
  );
};

export default QuotationDetail;