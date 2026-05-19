import React, { useContext, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useLocation } from "react-router-dom";
import PageLoader from "../../../components/ui/PageLoader"
import formatDate from "../../../utils/formatDate"
import Popup from "../../../components/ui/Popup"
import {
  downloadQuotationPdf,
}
  from "../../../api/quotationApi";


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
  const [warningPopup, setWarningPopup] = useState({
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
  if (quotation && !editData) {
    setEditData(quotation);
  }

  const [time] = useState(
    formatDate(new Date())
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


  const handleWhatsApp = () => {
    if (!editData?.whatsapp) {
      setWarningPopup({

        open: true,

        message:
          "Please add WhatsApp number",
      });
      return;
    }

    let phone = editData.whatsapp.toString().replace(/\D/g, "");

    if (phone.length === 10) {
      phone = "91" + phone;
    }

    const materialsText = (editData.materials || [])

      .filter(
        (m) =>
          m.size ||
          m.piece ||
          m.gauge
      )

      .map(
        (m, index) =>
          `• ${index + 1}. ${m.size || "-"} (${m.piece || 0} pcs | ${m.gauge || "-"} gauge)`
      )

      .join("\n");

    const message =
      `Hello ${editData.cliName},

         Your quotation:
         ${materialsText}

         Date: ${editData.quotationDate}

         Thank you!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
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

            {!isEditing ? (
              <Button btnName="Click to Edit" btnColor="secondary.main" onClick={() => { console.log("Before clicking the Edit button: ", isEditing); setIsEditing(true) }} />
            ) : (
              <Button btnName="Save" btnColor="green" onClick={handleSave} />
            )}

            <Button
              btnName="Show WhatsApp"
              btnColor="green"
              onClick={handleWhatsApp}
            />

            <Button
              btnName={
                isDownloading
                  ? "Downloading..."
                  : "Download PDF"
              }

              btnColor="red"

              onClick={async () => {

                try {

                  setIsDownloading(true);

                  const response =
                    await downloadQuotationPdf(
                      editData._id
                    );

                  if (response.success) {

                    const url =
                      window.URL.createObjectURL(

                        new Blob([
                          response.data,
                        ])
                      );

                    const link =
                      document.createElement(
                        "a"
                      );

                    link.href =
                      url;

                    link.setAttribute(

                      "download",

                      `${editData.cliName}_${editData.quotationNo}.pdf`
                    );

                    document.body.appendChild(
                      link
                    );

                    link.click();

                    link.remove();

                  }

                  else {

                    setWarningPopup({

                      open: true,

                      message:
                        response.message,
                    });
                  }

                }

                finally {

                  setIsDownloading(false);
                }
              }}
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
              inpValue={time}
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

    </Paper>
  );
};

export default QuotationDetail;