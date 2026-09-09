import {
  Box,
  Paper,
  Typography,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Select,
  MenuItem
} from "@mui/material";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Popup from "../../../components/ui/Popup";
import formatDate from "../../../utils/formatDate";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import { ClientContext } from "../../../contexts/client/clientContext"
import {
  downloadQuotationPdf,
  downloadQuotationExcel,
} from "../../../api/quotationApi";
import { generateQuotationJpg } from "../../../utils/handleDownloadPDF";
import { printQuotationWithSize } from "../../../utils/printQuotation";
import QuotationPdfTemplate from "./QuotationPdfTemplate";




const QuotationForm = ({ initialData = null }) => {
  const {
    handleCreateQuotation,
    handleUpdateQuotation,
    quotations,
  } = useContext(QuotationContext);
  const { clients } =
    useContext(ClientContext);

  const navi = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  // Fetch quotation data when in edit mode
  const quotation = quotations.find((q) => String(q.quotationNo) === String(id));
  
  const [showPopup, setShowPopup] = useState(false);
  const [duplicatePopup, setDuplicatePopup] = useState({
    open: false,
    message: "",
  });
  const [success, setSuccess] = useState({
    open: false,
    message: "",
  });
  const [shouldResetOnSuccess, setShouldResetOnSuccess] = useState(false);
  const [
    isSending,
    setIsSending
  ] = useState(false);
  const [
    isDownloading,
    setIsDownloading
  ] = useState(false);
  const [
    isDownloadingExcel,
    setIsDownloadingExcel
  ] = useState(false);
  const [
    isWhatsappLoading,
    setIsWhatsappLoading
  ] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  
  // Initialize form data with quotation data (edit mode) or defaults (create mode)
  const [formData, setFormData] = useState(() => {
    const dataToUse = isEditMode && quotation ? quotation : initialData;
    
    if (dataToUse) {
      return {
        cliId: dataToUse.cliId || "",
        cliName: dataToUse.cliName || "",
        mobile: dataToUse.mobile || "",
        whatsapp: dataToUse.whatsapp || "",
        materials: dataToUse.materials || Array(6).fill().map(() => ({
          size: "",
          piece: "",
          gauge: "",
        })),
        rateB1: dataToUse.rateB1 || "",
        rateB2: dataToUse.rateB2 || "",
        bending: dataToUse.bending || "",
        laserCutting: dataToUse.laserCutting || "",
        add: dataToUse.add || "",
        totalPieces: dataToUse.totalPieces || 0,
        status: dataToUse.status || "PENDING",
        quotationNo: dataToUse.quotationNo || null,
        quotationDate: dataToUse.quotationDate || new Date().toISOString(),
      };
    }
    return {
      cliId: "",
      cliName: "",
      mobile: "",
      whatsapp: "",
      materials: Array(6).fill().map(() => ({
        size: "",
        piece: "",
        gauge: "",
      })),
      rateB1: "",
      rateB2: "",
      bending: "",
      laserCutting: "",
      add: "",
      totalPieces: 0,
      status: "PENDING",
      quotationNo: null,
      quotationDate: new Date().toISOString(),
    };
  });
  
  // Update form data when quotation is loaded in edit mode
  useEffect(() => {
    if (isEditMode && quotation && !formData.quotationNo) {
      setFormData({
        cliId: quotation.cliId || "",
        cliName: quotation.cliName || "",
        mobile: quotation.mobile || "",
        whatsapp: quotation.whatsapp || "",
        materials: quotation.materials || Array(6).fill().map(() => ({
          size: "",
          piece: "",
          gauge: "",
        })),
        rateB1: quotation.rateB1 || "",
        rateB2: quotation.rateB2 || "",
        bending: quotation.bending || "",
        laserCutting: quotation.laserCutting || "",
        add: quotation.add || "",
        totalPieces: quotation.totalPieces || 0,
        status: quotation.status || "PENDING",
        quotationNo: quotation.quotationNo || null,
        quotationDate: quotation.quotationDate || new Date().toISOString(),
      });
    }
  }, [isEditMode, quotation, formData.quotationNo]);
  
  const [time] = useState(formatDate(new Date()));
  const [
    createdQuotation,
    setCreatedQuotation
  ] = useState(null);
  const [warningPopup, setWarningPopup] = useState({
    open: false,
    message: "",
  });
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSize, setPrintSize] = useState("small");
  const pdfRef = useRef(null);

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      materials: updatedMaterials,
    });
  };

  const handleAddRow = () => {
    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        {
          size: "",
          gauge: "",
          piece: "",
        },
      ],
    });
  };

  const handleRemoveRow = (index) => {
    const updated = formData.materials.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      materials: updated,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const totalPieces =
    formData.materials.reduce(

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

  const handleConfirmQuotation =
    async () => {

      // CLOSE POPUP IMMEDIATELY
      setShowPopup(false);

      try {

        setIsSending(
          true
        );

        let response;

        try {
          if (isEditMode && formData.quotationNo) {
            // UPDATE EXISTING QUOTATION
            response =
              await handleUpdateQuotation(
                formData.quotationNo,
                {
                  ...formData,
                  totalPieces,
                  laserCutting: formData.laserCutting || "",
                  whatsapp: formData.whatsapp || "",
                }
              );
          } else {
            // CREATE NEW QUOTATION
            response =
              await handleCreateQuotation({

              ...formData,

              totalPieces,

              laserCutting:
                formData.laserCutting || "",

              whatsapp:
                formData.whatsapp || "",

              status: "PENDING",
            });
          }

          console.log({
            totalPieces,
            formData,
            isEditMode,
          });
        }

        catch (error) {

          console.log(
            "Quotation Error:",
            error
          );

          setDuplicatePopup({

            open: true,

            message:
              isEditMode ? "Quotation update failed" : "Quotation creation failed",
          });

          return;
        }

        if (response.success) {
          setCreatedQuotation(
            response.data || response.quotation
          );

          setIsSending(
            false
          );

        } else {

          setDuplicatePopup({

            open: true,

            message:
              response.message,
          });
        }

      }

      finally {

        setIsSending(
          false
        );
      }
    };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !formData.cliName ||
        !formData.cliName.trim()
      ) {

        setDuplicatePopup({

          open: true,

          message:
            "Please enter client name",
        });

        return;
      }

      console.log(formData)

      // ONLY OPEN POPUP
      setShowPopup(true);
    };


  const handlePdfFile =
    async () => {

      try {

        setIsDownloading(
          true
        );

        const response =
          await downloadQuotationPdf(
            createdQuotation?.quotationNo
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
            createdQuotation?.quotationNo
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

  const INITIAL_FORM = {
    cliId: "",
    cliName: "",
    mobile: "",
    whatsapp: "",
    materials: Array(6).fill(null).map(() => ({ size: "", piece: "", gauge: "" })),
    rateB1: "",
    rateB2: "",
    bending: "",
    laserCutting: "",
    add: "",
    totalPieces: 0,
    status: "PENDING",
  };

  // Helper: Get only filled quotation rows
  const getFilledRows = () => {
    return formData.materials.filter(row => 
      String(row?.size || "").trim() || 
      String(row?.piece || "").trim() || 
      String(row?.gauge || "").trim()
    );
  };

  // Helper: Automatically select print size based on filled row count (3-phase)
  const getAutoPrintSize = () => {
    const filledCount = getFilledRows().length;
    if (filledCount <= 6) return "small";  // Phase 1: <=6 lines -> 3 slips on A4 (Green template)
    if (filledCount <= 13) return "mid";   // Phase 2: 7..13 lines -> 2 slips on A4 (Blue template)
    return "large";                         // Phase 3: >13 lines -> 1 slip on A4 (Blue template)
  };

  const handleWhatsApp = async () => {
    try {
      if (!formData?.whatsapp) {
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
      let phone = formData.whatsapp.toString().replace(/\D/g, "");
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
      setShouldResetOnSuccess(true);

    } finally {
      setIsWhatsappLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const autoSize = getAutoPrintSize();
      setPrintSize(autoSize);
      // Wait one tick for React to rerender the template with the new size
      await new Promise((resolve) => setTimeout(resolve, 200));
      await printQuotationWithSize(pdfRef, autoSize);
    } finally {
      setIsPrinting(false);
    }
  };



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

      <Box component="form" onSubmit={handleSubmit}>

        {/* Top Buttons */}
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

          {/* LEFT: Back */}
          <Button
            btnName="← Back"
            btnColor="gray"
            txtCol="black"
            onClick={() => navi("/quotations")}
          />

          {/* RIGHT: Actions */}
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
              disabled={isDownloadingExcel}
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
              disabled={isDownloading}
              onClick={handlePdfFile}
            />

            {/* Save Button - Create or Update */}
            <Button
              btnName={
                isSending
                  ? "Saving..."
                  : isEditMode
                    ? "Save"
                    : createdQuotation
                      ? "Quotation Created ✓"
                      : "Create Quotation →"
              }
              btnType="submit"
              btnColor={
                createdQuotation
                  ? "green"
                  : "secondary.main"
              }
              disabled={createdQuotation && !isEditMode}
            />

            <Button
              btnName="Close"
              btnColor="gray"
              txtCol="black"
              onClick={() => navi("/quotations")}
            />

          </Stack>

        </Box>


        {/* Client + Time */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", alignItems: "center", mb: 2 }}>

          {/* Client */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              minWidth: { xs: "100%", md: 300 }
            }}
          >

            {/* Label */}
            <Typography sx={{ minWidth: 120 }}>
              Client Name:
            </Typography>

            {/* Input Area */}
            {!isNewClient ? (
              <Select
                size="small"
                value={formData.cliId || ""}
                displayEmpty
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "__new__") {
                    setIsNewClient(true);
                    setFormData({
                      ...formData,
                      cliId: "",
                      cliName: "",
                      mobile: "",
                      whatsapp: "",
                    });
                  } else {
                    const selectedClient = clients.find(
                      (c) =>
                        String(c.cliId) === String(value)
                    );

                    if (!selectedClient) return;

                    setFormData({
                      ...formData,
                      cliId: value, // ✅ FIX
                      cliName: selectedClient.cliName,
                      mobile: selectedClient.mobile,
                      whatsapp: selectedClient.whatsapp,
                    });
                  }
                }}
                sx={{
                  flex: 1,
                  minWidth: 0
                }}
              >
                <MenuItem value="" disabled>
                  Select Client
                </MenuItem>

                <MenuItem value="__new__" sx={{ color: "primary.main" }}>
                  + Add New
                </MenuItem>

                {clients.map((client) => (
                  <MenuItem key={client.cliId} value={client.cliId}>
                    {client.cliName} ({client.mobile})
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: 1,
                }}
              >
                <Input
                  inpName="cliName"
                  inpValue={formData.cliName}
                  inpPlaceholder="Enter client name"
                  onChange={handleChange}
                  inpWidth="100%"
                  isReq={true}
                />

                <Button
                  btnName="Cancel"
                  btnColor="gray"
                  txtCol="black"
                  btnWidth="auto"
                  onClick={() => {
                    setIsNewClient(false);
                    setFormData({
                      ...formData,
                      cliName: "",
                      mobile: ""
                    });
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Time */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: "450px",
              justifyContent: "flex-end",
            }}
          >
            <Typography>Date:</Typography>

            <Input
              inpValue={time}
              readOnly
            />
          </Box>

        </Box>

        {/* Main Section */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mt: 3,
            width: "100%",
            alignItems: "flex-start",
          }}
        >

          {/* Table */}
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
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
                  <TableCell sx={{ width: "50%" }}>Size</TableCell>
                  <TableCell sx={{ width: "17%" }}>Peice</TableCell>
                  <TableCell sx={{ width: "18%" }}>Gauge</TableCell>
                  <TableCell sx={{ width: "10%" }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {formData.materials.map((row, i) => {
                  const isRowFilled = row.size || row.gauge || row.piece;

                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>

                      <TableCell>
                        <Input
                          inpValue={row.size}
                          onChange={(e) => {
                            handleMaterialChange(i, "size", e.target.value)
                          }}
                          isReq={isRowFilled}
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          inpValue={row.piece}
                          onChange={(e) => {
                            handleMaterialChange(i, "piece", e.target.value)
                          }}
                          isReq={isRowFilled}
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          inpValue={row.gauge}
                          onChange={(e) => {
                            handleMaterialChange(i, "gauge", e.target.value)
                          }}
                          isReq={isRowFilled}
                        />
                      </TableCell>

                      <TableCell>
                        <Button
                          btnName="X"
                          btnColor="red"
                          onClick={() => handleRemoveRow(i)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Box sx={{ marginTop: 1, display: "flex", justifyContent: "flex-end" }}>
              <Button
                btnName="+ Add Row"
                btnColor="green"
                onClick={handleAddRow}
              />
            </Box>

          </Box>

          {/* Right Section */}
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "13px" }}>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ minWidth: "40%" }}>Mobile No.:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="mobile"
                    isReq={true}
                    inpValue={formData.mobile}
                    disabled={!isNewClient && !!formData.cliId}  // ✅ KEY LINE
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleChange({ target: { name: "mobile", value } });
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ minWidth: "40%" }}>WhatsApp No.:</Typography>

                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="whatsapp"
                    inpValue={formData.whatsapp}
                    disabled={!isNewClient && !!formData.cliId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleChange({ target: { name: "whatsapp", value } });
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ minWidth: "40%" }}>Rate B1:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input inpName="rateB1" inpValue={formData.rateB1} onChange={handleChange} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ minWidth: "40%" }}>Rate B2:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input inpName="rateB2" inpValue={formData.rateB2} onChange={handleChange} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ minWidth: "40%" }}>Add:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input inpName="add" inpValue={formData.add} onChange={handleChange} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ minWidth: "40%" }}>Bending:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input inpName="bending" inpValue={formData.bending} onChange={handleChange} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ minWidth: "40%" }}>Laser Cutting:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input inpName="laserCutting" inpValue={formData.laserCutting} onChange={handleChange} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ minWidth: "40%" }}>Total Pieces:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input inpName="totalPieces" inpValue={totalPieces} disabled />
                </Box>
              </Box>

            </Box>

          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ marginTop: "35px" }} textAlign="center" variant="h5" color="text.secondary">
            માપ ચેક કરી ને રજા લેવી
            <br />
            કટિંગ કરેલ માલ પાછો રાખવા માં નહિ આવે
          </Typography>
        </Box>
      </Box>

      {/* Popup */}
      <Popup
        isOpen={showPopup}
        title="Quotation Created"
        message={`Create quotation for ${formData.cliName}?`}
        onConfirm={
          handleConfirmQuotation
        }
        onCancel={() => setShowPopup(false)}
      />


      <Popup
        isOpen={
          success.open
        }

        title="Action Complete"

        message={
          success.message
        }

        onConfirm={() => {
          setSuccess({
            open: false,
            message: "",
          });
          if (shouldResetOnSuccess) {
            setFormData(INITIAL_FORM);
            setCreatedQuotation(null);
            setShouldResetOnSuccess(false);
          }
        }}

        onCancel={() => {
          setSuccess({
            open: false,
            message: "",
          });
          if (shouldResetOnSuccess) {
            setFormData(INITIAL_FORM);
            setCreatedQuotation(null);
            setShouldResetOnSuccess(false);
          }
        }}
      />

      <Popup
        isOpen={
          duplicatePopup.open
        }
        title="Duplicate Mobile Number"
        message={
          duplicatePopup.message
        }
        onConfirm={() =>
          setDuplicatePopup({

            open: false,

            message: "",
          })
        }
        onCancel={() =>
          setDuplicatePopup({

            open: false,

            message: "",
          })
        }
      />

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
        <QuotationPdfTemplate
          ref={pdfRef}
          size={printSize}
          data={{
            ...formData,
            totalPieces,
            quotationDate: new Date().toISOString(),
          }}
        />
      </Box>

    </Paper>
  );
};

export default QuotationForm;