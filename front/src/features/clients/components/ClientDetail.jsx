import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { useContext, useState } from "react";
import { ClientContext } from "../../../contexts/client/clientContext";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Popup from "../../../components/ui/Popup";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";

const ClientDetail = () => {
  const { id } = useParams();
  const navi = useNavigate();
  const [editPopup, setEditPopup] = useState(false);
  const [mobilePopup, setMobilePopup] = useState(false);
  const [editData, setEditData] = useState({
    cliName: "",
    mobile: "",
  });
  const { clients, setClients } = useContext(ClientContext);
  const { quotations } = useContext(QuotationContext);

  const client = clients.find(
    (c) => c.cliId === Number(id)
  );

  const clientQuotations = quotations.filter(
    q => Number(q.cliId) === Number(client?.cliId)
  );

  if (!client) return <Typography>Client not found</Typography>;

  const totalAmount = clientQuotations.reduce(
    (sum, q) => sum + Number(q.amount || 0),
    0
  );

  console.log("Client:", client.cliId);
  console.log("Quotations:", quotations);

  const handleUpdateClient = () => {
    if (!editData.cliName.trim()) return;

    const exists = clients.some(
      (c) =>
        c.mobile === editData.mobile &&
        c.cliId !== client.cliId
    );

    if (exists) {
      // alert("Mobile already exists");
      setMobilePopup(true)
      return;
    }

    const updatedClients = clients.map((c) =>
      c.cliId === client.cliId
        ? {
          ...c,
          cliName: editData.cliName.trim(),
          mobile: editData.mobile.trim(),
        }
        : c
    );

    setClients(updatedClients);
    setEditPopup(false);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        {/* 🔙 Back */}
        <Button
          btnName="← Back"
          btnColor="gray"
          txtCol="black"
          onClick={() => navi("/clients")}
        />

        <Button
          btnName="Edit Detail"
          btnColor="secondary.main"
          txtCol="white"
          onClick={() => {
            setEditData({
              cliName: client.cliName,
              mobile: client.mobile,
            });
            setEditPopup(true);
          }}
        />
      </Box>


      {/* 📦 Main Card */}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 2,
          border: "1px solid #e2e8f0",
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {/* 🔹 Client Info */}
          <Stack spacing={1} mb={3} sx={{ marginBottom: "25px" }}>

            <Typography variant="h4" fontWeight="600">
              {client.cliName}
            </Typography>

            <Typography color="text.secondary">
              📞 {client.mobile}
            </Typography>

          </Stack>

          {/* 🔹 Stats */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mb: 4,
              flexWrap: "wrap"
            }}
          >
            <Box sx={statBox}>
              <Typography sx={{ fontSize: "15px" }}>Total Quotations</Typography>
              <Typography variant="h5">
                {clientQuotations.length || 0}
              </Typography>
            </Box>

            <Box sx={statBox}>
              <Typography sx={{ fontSize: "15px" }}>Total Amount</Typography>
              <Typography variant="h5">
                ₹ {totalAmount}
              </Typography>
            </Box>

          </Box>

        </Box>

        {/* 🔹 Quotation List */}
        <TableContainer
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 2,
          }}
        >
          <Table>

            {/* 🔹 Head */}
            <TableHead sx={{ bgcolor: "#f2f4f5", borderBottom: "2px solid gray" }}>
              <TableRow hover>
                <TableCell>No.</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="center">View Details</TableCell>
              </TableRow>
            </TableHead>

            {/* 🔹 Body */}
            <TableBody>
              {clientQuotations?.length > 0 ? (
                clientQuotations.map((q, index) => (
                  <TableRow key={q.id} hover>

                    {/* No */}
                    <TableCell>{index + 1}</TableCell>

                    {/* Status */}
                    <TableCell>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            q.status === "PENDING"
                              ? "#fef3c7"
                              : "#dcfce7",
                        }}
                      >
                        {q.status}
                      </Box>
                    </TableCell>

                    {/* Date */}
                    <TableCell>{q.quotationDate}</TableCell>

                    {/* Material */}
                    <TableCell>
                      {
                        [...new Set(
                          (q.materials || [])
                            .filter(m => m.size)
                            .map(m => m.size)
                        )].join(", ") || "-"
                      }
                    </TableCell>
                    
                    {/* Amount */}
                    <TableCell sx={{ fontWeight: "500" }}>
                      ₹ {q.amount}
                    </TableCell>

                    {/* View */}
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => {
                          navi(`/quotations/${q.id}`, {
                            state: { from: `/clients/${client.cliId}` }
                          });
                        }}
                      >
                        View →
                      </Typography>
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">
                      No quotations available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </TableContainer>

      </Paper>

      {/* Edit Name PopUp */}
      <Popup
        isOpen={editPopup}
        title="Edit Client Details"
        message={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            {/* Name */}
            <Box>
              <Typography variant="caption">Client Name</Typography>
              <Input
                inpName="cliName"
                inpValue={editData.cliName}
                onChange={handleEditChange}
                inpWidth="100%"
              />
            </Box>

            {/* Mobile */}
            <Box>
              <Typography variant="caption">Mobile Number</Typography>
              <Input
                inpName="mobile"
                inpValue={editData.mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setEditData({
                      ...editData,
                      mobile: value,
                    });
                  }
                }}
                inpWidth="100%"
              />
            </Box>

          </Box>
        }
        onConfirm={handleUpdateClient}
        onCancel={() => setEditPopup(false)}
      />


      <Popup
        isOpen={mobilePopup}
        title="Already Exists"
        message="This mobile number is exist for another user"
        onConfirm={() => {
          navi(`/clients/${client.cliId}`);
          setMobilePopup(false);
        }}
        onCancel={() => setMobilePopup(false)}
      />

    </Box>
  );
};

const statBox = {
  p: 2,
  borderRadius: 2,
  bgcolor: "#f1f5f9",
  minWidth: 150,
};

export default ClientDetail;