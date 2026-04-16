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
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import getCurrentDateTime from "../../../utils/getCurrentDateAndTime";
import calculateAmount from "../../../utils/calculateQuotationAmount";
// import { handleDownloadPDF } from "../../../utils/handleDownloadPDF";

const QuotationDetail = () => {
  const { quotations, setQuotations } = useContext(QuotationContext);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  console.log("After initiaion: ", isEditing)

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
    setEditData(updatedItem);

    console.log("Before saving: ", isEditing)
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
            onClick={() => navi("/quotations")}
          />

          {/* RIGHT */}
          <Stack direction="row" spacing={1.5}>

            {!isEditing ? (
              <Button btnName="Click to Edit" btnColor="secondary.main" onClick={() => { console.log("Before clicking the Edit button: ", isEditing); setIsEditing(true) }} />
            ) : (
              <Button btnName="Save" btnColor="green" onClick={handleSave} />
            )}
            {/* 
            <Button
              btnName="Print"
              btnColor="red"
              onClick={() =>
                handleDownloadPDF({ pdfRef, data: editData })
              }
            /> */}

            <Button
              btnName="Print"
              btnColor="red"
              onClick={() =>
                window.print()
              }
            />
          </Stack>

        </Box>

        {/* MAIN CONTAINER (MATCHED) */}
        <Box ref={pdfRef}>

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
              inpValue={editData.quotationDate}
              readOnly
            />
          </Box>

          {/* MAIN SECTION */}
          <Grid container spacing={3} mt={1}>

            {/* TABLE (MATCHED STYLE) */}
            <Grid item xs={12} md={8}>
              <Box sx={{ height: "100%" }}>
                <TableContainer
                  sx={{ height: "100%" }}
                >
                  <Table
                    sx={{
                      width: "90%",
                      height: "70%",
                      "& th, & td": {
                        padding: "3px",
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "5%" }}>No.</TableCell>
                        <TableCell sx={{ width: "40%" }}>Name</TableCell>
                        <TableCell sx={{ width: "15%" }}>Gej</TableCell>
                        <TableCell sx={{ width: "15%" }}>Price</TableCell>
                        <TableCell sx={{ width: "15%" }}>Qty</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {editData.materials.map((_, i) => (
                        <TableRow key={i}>

                          {/* Index */}
                          <TableCell sx={{ p: "3px" }}>{i + 1}</TableCell>

                          {/* Reusable Cells */}
                          {renderCell("nameOfMaterial", i)}
                          {renderCell("gej", i)}
                          {renderCell("pic", i)}
                          {renderCell("qty", i)}

                        </TableRow>
                      ))}
                    </TableBody>

                  </Table>
                </TableContainer>
              </Box>

            </Grid>

            {/* RIGHT SECTION (MATCHED) */}
            <Stack spacing={1} sx={{ width: "25%", display: "flex", flexDirection: "column", gap: "15px" }}>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <Typography>Mobile No.:</Typography>
                <Input
                  inpName="mobile"
                  inpValue={editData.mobile}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <Typography>Rate B:</Typography>
                <Input
                  inpName="rateB"
                  inpValue={editData.rateB}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <Typography>Bending:</Typography>
                <Input
                  inpName="bending"
                  inpValue={editData.bending}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <Typography>Add:</Typography>
                <Input
                  inpName="add"
                  inpValue={editData.add}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <Typography>Quotation Amount:</Typography>
                <Input readOnly inpValue={total} />
              </Box>

            </Stack>

          </Grid>

        </Box>

      </Box>

    </Paper>
  );
};

export default QuotationDetail;