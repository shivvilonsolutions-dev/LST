import {
  Box,
  Paper,
  Typography,
  Grid,
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
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import { ClientContext } from "../../../contexts/client/clientContext"
import getCurrentDateTime from "../../../utils/getCurrentDateAndTime";
import calculateAmount from "../../../utils/calculateQuotationAmount";

const QuotationForm = () => {
  const navi = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [mobilePopup, setMobilePopup] = useState(false);
  const [time, setTime] = useState(getCurrentDateTime());
  const { quotations, setQuotations } = useContext(QuotationContext);
  const { clients, setClients } = useContext(ClientContext);
  const [isNewClient, setIsNewClient] = useState(false);
  const [formData, setFormData] = useState({
    cliId: "",
    cliName: "",
    mobile: "",
    amount: "",
    materials: Array(6).fill({
      size: "",
      gej: "",
      pic: "",
      category: "",
    }),
    rateB1: "",
    rateB2: "",
    bending: "",
    add: "",
    status: "PENDING",
  });


  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = calculateAmount(formData);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    let finalCliId = formData.cliId;
    let index = -1;

    if (formData.cliId) {
      index = clients.findIndex(
        (c) => Number(c.cliId) === Number(formData.cliId)
      );
    } else if (formData.mobile) {
      index = clients.findIndex(
        (c) => c.mobile === formData.mobile
      );
    }

    if (index === -1) {
      finalCliId = Date.now();

      const newClient = {
        cliId: finalCliId,
        cliName: formData.cliName,
        mobile: formData.mobile,
        dateOfJoin: getCurrentDateTime(),
      };

      setClients([newClient, ...clients]);
    }
    else {
      finalCliId = clients[index].cliId;
    }

    const newQuotation = {
      ...formData,
      id: Date.now(),
      cliId: Number(finalCliId),
      status: "PENDING",
      quotationDate: getCurrentDateTime(),
      amount: total,
    };

    setQuotations([newQuotation, ...quotations]);

    const quotationEntry = {
      id: newQuotation.id,
      date: newQuotation.quotationDate,
      materials: newQuotation.materials,
      amount: newQuotation.amount,
      dateOfQuotation: newQuotation.quotationDate,
    };

    if (index !== -1) {
      const updatedClients = [...clients];

      updatedClients[index].quotationList = [
        ...(updatedClients[index].quotationList || []),
        quotationEntry,
      ];

      setClients(updatedClients);
    }

    setShowPopup(true);
  };
  const handleWhatsApp = () => {
    if (!formData.mobile) {
      setMobilePopup(true);

      return;
    }

    let phone = formData.mobile.toString().replace(/\D/g, "");

    if (phone.length === 10) {
      phone = "91" + phone;
    }

    const materialsText = formData.materials
      .filter(m => m.nameOfMaterial)
      .map(m => `• ${m.nameOfMaterial} (${m.pic} * ${m.qty})`)
      .join("\n");

    const message =
      `Hello ${formData.cliName},

Your quotation: 
${materialsText}

Amount: ${total}
Date: ${getCurrentDateTime()}

Thank you!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
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

            <Button
              btnName="Show WhatsApp"
              btnColor="green"
              onClick={handleWhatsApp}
            />

            <Button
              btnName="Send Quotation →"
              btnType="submit"
              btnColor="secondary.main"
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
                      mobile: ""
                    });
                  } else {
                    const selectedClient = clients.find(
                      (c) => Number(c.cliId) === Number(value)
                    );

                    if (!selectedClient) return;

                    setFormData({
                      ...formData,
                      cliId: Number(value), // ✅ FIX
                      cliName: selectedClient.cliName,
                      mobile: selectedClient.mobile,
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
                  <TableCell sx={{ width: "40%" }}>Size</TableCell>
                  <TableCell sx={{ width: "21%" }}>Category</TableCell>
                  <TableCell sx={{ width: "12%" }}>Peice</TableCell>
                  <TableCell sx={{ width: "12%" }}>Gauge</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {formData.materials.map((row, i) => {
                  const isRowFilled = row.size || row.gej || row.pic;

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
                        <Select
                          size="small"
                          displayEmpty
                          value={row.category || ""}
                          onChange={(e) =>
                            handleMaterialChange(i, "category", e.target.value)
                          }
                          sx={{ width: "100%", color: row.category ? "inherit" : "text.secondary" }}
                        >
                          <MenuItem value="">Select Category</MenuItem>
                          <MenuItem value="B1">Category - 1</MenuItem>
                          <MenuItem value="B2">Category - 2</MenuItem>
                          <MenuItem value="B3">Category - 3</MenuItem>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <Input
                          inpValue={row.pic}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            handleMaterialChange(i, "pic", value)
                          }}
                          isReq={isRowFilled}
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          inpValue={row.gej}
                          onChange={(e) => {
                            handleMaterialChange(i, "gej", e.target.value)
                          }}
                          isReq={isRowFilled}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

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
                <Typography sx={{ minWidth: "40%" }}>Rate B1:</Typography>
                <Box sx={{ width: "60%" }}>
                  <Input inpName="rateB1" inpValue={formData.rateB1} onChange={handleChange} isReq={true} />
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

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ width: "40%" }}>
                  Quotation Amount:
                </Typography>

                <Box sx={{ width: "60%" }}>
                  <Input inpValue={total} readOnly />
                </Box>
              </Box>

            </Box>

          </Box>
        </Box>


        {/* Footer */}
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ marginTop: "25px" }} textAlign="center" variant="h5" color="text.secondary">
            માપ ચેક કરી ને રજા લેવી
            <br />
            <br />
            કટિંગ કરેલ માલ પાછો રાખવા માં નહિ આવે
          </Typography>
        </Box>

        {/* Popup */}
        <Popup
          isOpen={showPopup}
          title="Confirm Action"
          message={`Are you sure to send the Quotation to ${formData.cliName}?`}
          onConfirm={() => {
            navi("/quotations");
            setShowPopup(false);
          }}
          onCancel={() => setShowPopup(false)}
        />

        <Popup
          isOpen={mobilePopup}
          title="Requirement"
          message="Please add 10 digit mobile number"
          onConfirm={() => {
            navi("/quotations/send-quotation");
            setMobilePopup(false);
          }}
          onCancel={() => setMobilePopup(false)}
        />
      </Box>
    </Paper>
  );
};

export default QuotationForm;