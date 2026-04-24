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

        <Typography variant="h5" fontWeight={500}>
          {title}
        </Typography>

        <Box
          sx={{
            mt: 1,
            px: 2,
            py: "4px",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            display: "inline-block",
            
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            mt={1}
            sx={{ color: valColor }}
          >
            Count: {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsCard;