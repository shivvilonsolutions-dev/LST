import React, { useContext, useState, useEffect, useRef } from "react";
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
import { ClientContext } from "../../../contexts/client/clientContext"
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import getCurrentDateTime from "../../../utils/getCurrentDateAndTime";
import calculateAmount from "../../../utils/calculateQuotationAmount";
import { handleDownloadPDF } from "../../../utils/handleDownloadPDF";
import { useLocation } from "react-router-dom";


const QuotationDetail = () => {
  const location = useLocation();
  const { quotations, setQuotations } = useContext(QuotationContext);
  const { clients, setClients } = useContext(ClientContext);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const navi = useNavigate();
  const pdfRef = useRef();

  const quotation = quotations.find((q) => q.id == Number(id));
  const [editData, setEditData] = useState(quotation);

  useEffect(() => {
    setEditData(quotation);
  }, [quotation]);

  const total = calculateAmount(editData);

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

  const handleSave = () => {
    const updatedItem = {
      ...editData,
      quotationDate: getCurrentDateTime(),
      amount: total,
    };

    const updatedData = quotations.map((item) =>
      item.id == id ? updatedItem : item
    );

    setQuotations(updatedData);
    
    const updatedClients = clients.map((c) => {
      if (c.cliId === quotation.cliId) {
        return {
          ...c,
          cliName: updatedItem.cliName,
          mobile: updatedItem.mobile,
          quotationList: c.quotationList.map((q) =>
            q.id == id
              ? {
                ...q,
                amount: updatedItem.amount,
                date: updatedItem.quotationDate,
                materials: updatedItem.materials,
              }
              : q
          ),
        };
      }
      return c;
    });

    setClients(updatedClients);
    setEditData(updatedItem);

    setIsEditing(false);
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
              btnName="Print"
              btnColor="red"
              onClick={() =>
                handleDownloadPDF({ pdfRef, data: editData })
              }
            />

          </Stack>

        </Box>

        {/* MAIN CONTAINER (MATCHED) */}
        <Box ref={pdfRef} >

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
              readOnly={true}
            />

            <Typography>Date:</Typography>
            <Input
              inpValue={editData.quotationDate}
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
                      {renderCell("gej", i)}
                      {renderCell("pic", i)}

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
                    readOnly={true}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>Rate B1:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input
                    inpName="rateB"
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
                    inpName="rateB"
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
                <Typography>Quotation Amount:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input readOnly inpValue={total} />
                </Box>
              </Box>



            </Box>
          </Box>
        </Box>

      </Box>

    </Paper>
  );
};

export default QuotationDetail;