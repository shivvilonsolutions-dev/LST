import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const StatsCard = ({ title, value, active, valColor, cardBgColor }) => {
  return (
    <Paper
      elevation={active ? 4 : 2}
      sx={{
        p: 3,
        bgcolor: cardBgColor,
        borderRadius: 3,
        textAlign: "center",
        border: "1px solid",
        borderColor: active ? "primary.main" : "grey.300",
        transition: "0.3s",
      }}
    >
      <Box>
        
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>

        <Typography
          variant="h5"
          fontWeight="bold"
          mt={1}
          sx = {{ color : valColor}}
        >
          {value}
        </Typography>

      </Box>
    </Paper>
  );
};

export default StatsCard;