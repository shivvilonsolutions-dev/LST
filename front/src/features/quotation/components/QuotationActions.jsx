import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  InputAdornment,
  Button as MuiButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { printQuotationsReport, downloadQuotationsReportPdf } from "../../../utils/printQuotationsReport";
import BulkWhatsAppModal from "./BulkWhatsAppModal";


import {
  LocalizationProvider,
} from "@mui/x-date-pickers/LocalizationProvider";

import {
  AdapterDayjs,
} from "@mui/x-date-pickers/AdapterDayjs";

import {
  DatePicker,
} from "@mui/x-date-pickers/DatePicker";

import dayjs
  from "dayjs";

import SearchIcon from "@mui/icons-material/Search";
import Button from "../../../components/ui/Button";

const QuotationActions = ({
  setFilter,
  setSearch,
  setSelectedMonth,
  search,
  filter,
  selectedMonth,
  filteredCount,
  filteredData = []
}) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("ALL");
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  const [monthValue,
    setMonthValue] =
    useState(null);

  const handleChange = (_, newValue) => {
    if (newValue !== null) {
      setValue(newValue);
      setFilter(newValue);
    }
  };

  const handleMonthChange =
    (newValue) => {

      setMonthValue(
        newValue
      );

      if (
        !newValue
      ) {

        setSelectedMonth(
          null
        );

        return;
      }


      setSelectedMonth(

        dayjs(newValue)
          .startOf("month")
          .toDate()
      );
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
      <Stack direction="row" spacing={2} alignItems="center" >

        {(search || monthValue)&& (

          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor:
                filteredCount === 0
                  ? "#fdecea"
                  : "#e6edf7",

              color:
                filteredCount === 0
                  ? "error.main"
                  : "inherit",

              borderRadius: 1,
              fontSize: "15px",
              fontWeight: 500,
              border:
                "1px solid #cbd5e1",

              whiteSpace:
                "nowrap",
            }}
          >
            {filteredCount}
            {" "}result
            {filteredCount !== 1 && "s"}
          </Box>

        )}

        <LocalizationProvider
          dateAdapter={
            AdapterDayjs
          }
        >
          <DatePicker

            views={[
              "year",
              "month",
            ]}

            label="Select Month"

            value={monthValue}

            onChange={
              handleMonthChange
            }

            slotProps={{

              textField: {

                size: "small",

                sx: {

                  width: 180,

                  bgcolor:
                    "white",

                  "& .MuiOutlinedInput-root": {

                    borderRadius: 1,
                  },
                },
              },

              actionBar: {

                actions: [
                  "clear",
                ],
              },
            }}
          />

        </LocalizationProvider>

        <TextField
          size="small"
          placeholder="Search here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 260,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              bgcolor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),

            endAdornment:
              search && (

                <Typography
                  sx={{
                    cursor: "pointer",
                    fontSize: "14px",
                    px: 1,
                    color: "text.secondary",
                  }}
                  onClick={() =>
                    setSearch("")
                  }
                >
                  ✕
                </Typography>

              ),
          }}
        />

        {/* Print A4 Report */}
        <MuiButton
          variant="outlined"
          size="small"
          startIcon={<PrintIcon />}
          onClick={() =>
            printQuotationsReport({
              data: filteredData,
              search,
              filter,
              selectedMonth,
            })
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#0f766e",
            borderColor: "#0f766e",
            "&:hover": { bgcolor: "#f0fdfa", borderColor: "#0f766e" },
            whiteSpace: "nowrap",
            px: 1.5,
            py: 0.8,
            borderRadius: 1.5,
          }}
        >
          Print List (A4)
        </MuiButton>

        {/* Download A4 PDF Report */}
        <MuiButton
          variant="outlined"
          size="small"
          startIcon={<PictureAsPdfIcon />}
          onClick={() =>
            downloadQuotationsReportPdf({
              data: filteredData,
              search,
              filter,
              selectedMonth,
            })
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#be123c",
            borderColor: "#be123c",
            "&:hover": { bgcolor: "#fff1f2", borderColor: "#be123c" },
            whiteSpace: "nowrap",
            px: 1.5,
            py: 0.8,
            borderRadius: 1.5,
          }}
        >
          PDF Download
        </MuiButton>

        {/* Customised WhatsApp Message Button */}
        <MuiButton
          variant="contained"
          size="small"
          startIcon={<WhatsAppIcon />}
          onClick={() => setWhatsAppModalOpen(true)}
          disabled={!filteredData || filteredData.length === 0}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#25D366",
            color: "#ffffff",
            "&:hover": { bgcolor: "#1ebd5a" },
            whiteSpace: "nowrap",
            px: 1.5,
            py: 0.8,
            borderRadius: 1.5,
          }}
        >
          WhatsApp Message
        </MuiButton>

        <Button
          btnName="+ Create Quotation"
          btnColor="secondary.main"
          btnWidth="auto"
          onClick={() => navigate("/quotations/send-quotation")}
        />

      </Stack>

      {/* Bulk WhatsApp Custom Message Modal */}
      <BulkWhatsAppModal
        open={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        data={filteredData}
        searchQuery={search}
      />
    </Box>
  );
};

export default QuotationActions;