import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import Button from "../../../components/ui/Button";

const QuotationActions = ({ setFilter, setSearch }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("ALL");

  const handleChange = (_, newValue) => {
    if (newValue !== null) {
      setValue(newValue);
      setFilter(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      
      {/* LEFT: Filters */}
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          bgcolor: "#f1f5f9",
          borderRadius: 2,
          p: 0.5,

          "& .MuiToggleButton-root": {
            border: "none",
            textTransform: "none",
            px: 2,
            fontWeight: 500,

            "&.Mui-selected": {
              bgcolor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            },
          },
        }}
      >
        <ToggleButton value="ALL">All</ToggleButton>
        <ToggleButton value="PENDING">Pending</ToggleButton>
        <ToggleButton value="CONFIRM">Confirmed</ToggleButton>
      </ToggleButtonGroup>

      {/* RIGHT: Search + Button */}
      <Stack direction="row" spacing={2} alignItems="center">
        
        <TextField
          size="small"
          placeholder="Search by client name..."
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 260,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              bgcolor: "white",
            },
          }}
          inputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          btnName="+ Send Quotation"
          btnColor="secondary.main"
          btnWidth="auto"
          onClick={() => navigate("/quotations/send-quotation")}
        />

      </Stack>
    </Box>
  );
};

export default QuotationActions;