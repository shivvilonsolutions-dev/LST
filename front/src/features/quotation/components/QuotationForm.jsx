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
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import { ClientContext } from "../../../contexts/client/clientContext"
import {
  downloadQuotationPdf,
  downloadQuotationExcel,
  generateWhatsappPdf,
} from "../../../api/quotationApi";


const QuotationForm = () => {
  const {
    handleCreateQuotation,
  } = useContext(QuotationContext);
  const { clients } =
    useContext(ClientContext);

  const navi = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [duplicatePopup, setDuplicatePopup] = useState({
    open: false,
    message: "",
  });
  const [success, setSuccess] = useState({
    open: false,
    message: "",
  });
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
  const [formData, setFormData] = useState({
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
  });
  const [time] = useState(formatDate(new Date()));
  const [
    createdQuotation,
    setCreatedQuotation
  ] = useState(null);
  const [warningPopup, setWarningPopup] = useState({
    open: false,
    message: "",
  });

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

          console.log({
            totalPieces,
            formData,
          });
        }

        catch (error) {

          console.log(
            "Quotation Create Error:",
            error
          );

          setDuplicatePopup({

            open: true,

            message:
              "Quotation creation failed",
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

  const handleWhatsApp =
    async () => {

      try {

        if (!formData?.whatsapp) {

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


        let phone =
          formData.whatsapp
            .toString()
            .replace(/\D/g, "");


        if (
          phone.length === 10
        ) {

          phone =
            "91" + phone;
        }

        const materialsText =

          formData.materials

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

`Hello ${formData.cliName},

Your quotation details:

${materialsText}

Total Pieces : ${totalPieces}

--------------------------------

Rate B1      : ${formData.rateB1 || "-"}
Rate B2      : ${formData.rateB2 || "-"}
Add          : ${formData.add || "-"}
Bending      : ${formData.bending || "-"}
Laser Cutting: ${formData.laserCutting || "-"}

--------------------------------

માપ ચેક કરી ને રજા લેવી
કટિંગ કરેલ માલ પાછો રાખવામાં નહિ આવે

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

            {/* Whatsapp Button */}
            <Button
              btnName={
                isWhatsappLoading
                  ? "Opening WhatsApp..."
                  : "Show WhatsApp"
              }
              btnColor="green"
              disabled={!createdQuotation || isWhatsappLoading}
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
              disabled={!createdQuotation || isDownloadingExcel}
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
              disabled={!createdQuotation || isDownloading}
              onClick={handlePdfFile}
            />

            {/* Create Button */}
            <Button
              btnName={
                isSending
                  ? "Saving Data..."
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
              disabled={createdQuotation}
            />

            <Button
              btnName="Close"
              btnColor="gray"
              txtCol="black"
              disabled={!createdQuotation}
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
            alignItems: "center",
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

        title="File saved successfully!"

        message={
          success.message
        }

        onConfirm={() => {

          setSuccess({

            open: false,

            message: "",
          });
        }}

        onCancel={() =>
          setSuccess({

            open: false,

            message: "",
          })
        }
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

    </Paper>
  );
};

export default QuotationForm;