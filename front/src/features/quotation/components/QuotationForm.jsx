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
} from "@mui/material";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Popup from "../../../components/ui/Popup";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import getCurrentDateTime from "../../../utils/getCurrentDateAndTime";
import calculateAmount from "../../../utils/calculateQuotationAmount";

const QuotationForm = () => {
  const navi = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [mobilePopup, setMobilePopup] = useState(false);
  const [time, setTime] = useState(getCurrentDateTime());
  const { quotations, setQuotations } = useContext(QuotationContext);
  const [formData, setFormData] = useState({
    cliName: "",
    mobile: "",
    amount: "",
    materials: Array(5).fill({
      nameOfMaterial: "",
      gej: "",
      pic: "",
      qty: "",
    }),
    rateB: "",
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

    const newQuotation = {
      ...formData,
      id: Date.now(),
      quotationDate: getCurrentDateTime(),
      amount: total,
    };

    setQuotations([...quotations, newQuotation]);
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
        <Box sx={{ display: "flex", gap: 2, justifyContent: "specify-around", alignItems: "center", mb: 2 }}>

          <Typography sx={{ minWidth: 95 }}>Client Name:</Typography>
          <Input inpName="cliName" isReq={true} inpValue={formData.cliName} inpPlaceholder="Enter Client Name" onChange={handleChange} />

          <Typography>Date:</Typography>
          <Input inpValue={time} readOnly sx={{ width: 20 }} />

        </Box>

        {/* Main Section */}
        <Grid container spacing={3} mt={2} sx={{marginTop: "30px "}}>

          {/* Table */}
          <Grid item xs={12} md={6}>
            <Table
              sx={{
                "& th, & td": {
                  padding: "3px",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "5%" }}>No.</TableCell>
                  <TableCell sx={{ width: "40%" }}>Name</TableCell>
                  <TableCell sx={{ width: "15%" }}>Gauge</TableCell>
                  <TableCell sx={{ width: "15%" }}>Price (per item)</TableCell>
                  <TableCell sx={{ width: "15%" }}>Quantity</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {formData.materials.map((row, i) => {
                  const isRowFilled =
                    row.nameOfMaterial || row.gej || row.pic || row.qty;

                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>

                      <TableCell>
                        <Input
                          inpValue={row.nameOfMaterial}
                          onChange={(e) =>
                            handleMaterialChange(i, "nameOfMaterial", e.target.value)
                          }
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

                      <TableCell>
                        <Input
                          inpValue={row.pic}
                          onChange={(e) =>{
                            const value = e.target.value.replace(/\D/g, "");
                            handleMaterialChange(i, "pic", value)
                          }}
                          isReq={isRowFilled}
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          inpValue={row.qty}
                          onChange={(e) =>{
                            const value = e.target.value.replace(/\D/g, "");
                            handleMaterialChange(i, "qty", value)
                          }}
                          isReq={isRowFilled}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Footer */}
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ marginTop: "25px" }} textAlign="center" variant="h5" color="text.secondary">
                માપ ચેક કરી ને રજા લેવી
                <br />
                <br />
                કટિંગ કરેલ માલ પાછો રાખવા માં નહિ આવે
              </Typography>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={6} sx={{ marginLeft: "30px", width: "28%", display: "flex", flexDirection: "column", gap: "15px" }}>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Mobile No.:</Typography>
              <Input inpName="mobile" isReq={true} inpValue={formData.mobile} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange({ target: { name: "mobile", value } });
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Rate B:</Typography>
              <Input inpName="rateB" inpValue={formData.rateB} onChange={handleChange} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Bending:</Typography>
              <Input inpName="bending" inpValue={formData.bending} onChange={handleChange} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Add:</Typography>
              <Input inpName="add" inpValue={formData.add} onChange={handleChange} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Quotation Amount:</Typography>
              <Input inpValue={total} readOnly />
            </Box>

          </Grid>

        </Grid>

        {/* Popup */}
        <Popup
          isOpen={showPopup}
          title="Confirm Action"
          message="Are you sure to send the Quotation?"
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