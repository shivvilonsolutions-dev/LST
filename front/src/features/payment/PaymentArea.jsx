import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const PaymentArea = () => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Payments
        </Typography>

        <Typography color="text.secondary">
          This is the area where details of Payments will be shown.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PaymentArea;