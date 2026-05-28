import React, { useContext, useState, useEffect } from "react";
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
  const navi = useNavigate();
  const quotation =
    quotations.find(
      (q) =>
        String(q.quotationNo) === String(id)
    );

  const [editData, setEditData] = useState(quotation || null);
  useEffect(() => {
    if (
      quotation &&
      !editData
    ) {
      setEditData(
        quotation
      );
    }
  }, [
    quotation,
    editData,
  ]);

  const displayDate =
    formatDate(

      editData?.updatedAt
      ||
      editData?.quotationDate
    );

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

  const handleWhatsApp =
    async () => {

      try {

        if (!editData?.whatsapp) {

          setWarningPopup({

            open: true,

            message:
              "Please add WhatsApp number",
          });

          return;
        }


        setIsWhatsappLoading(
          true
        );


        const response =
          await generateWhatsappPdf(
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


        let phone =
          editData.whatsapp
            .toString()
            .replace(/\D/g, "");


        if (
          phone.length === 10
        ) {

          phone =
            "91" + phone;
        }

        const materialsText =

          editData.materials

            ?.filter((m) => m.size)

            ?.map(

              (m, index) =>

                `${index + 1}. ${m.size}`

                +

                (m.piece
                  ? ` (${m.piece} pcs)`
                  : "")

                +

                (m.gauge
                  ? ` | ${m.gauge}`
                  : "")
            )

            .join("\n");


        const message =

          `Hello ${editData.cliName},

Your quotation details:

${materialsText}

Thank you!`;


        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");

        // ─── STEP 2: OPEN FILE POPUP 1.5 SECONDS LATER ───
        if (window.electronAPI?.saveFileDialog && response.pdfPath) {
          setTimeout(async () => {
            try {
              const dialogResult = await window.electronAPI.saveFileDialog({
                defaultPath: response.pdfPath, // e.g., "C:/path/to/Quotation_123.xlsx"
              });

              if (!dialogResult.canceled && dialogResult.filePath) {
                console.log("File marked for save at:", dialogResult.filePath);
              }
            } catch (err) {
              console.error("Delayed file dialog error:", err);
            }
          }, 500); // 500ms delay gives WhatsApp room to load comfortably first
        }

      }

      finally {

        setIsWhatsappLoading(
          false
        );
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

            {/* Whatsapp Button */}
            <Button
              btnName={
                isWhatsappLoading
                  ? "Opening WhatsApp..."
                  : "Show WhatsApp"
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
              alignItems: "center",
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

            </Box>
          </Box>
        </Box>

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
        } }

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