import React, { useContext, useState, useRef, useEffect } from "react";
import {
  TextField,
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ClientContext } from "../../contexts/client/clientContext";
import Button from "../../components/ui/Button";
import Popup from "../../components/ui/Popup";
import { Popover } from "@mui/material";
import { QuotationContext } from "../../contexts/quotation/quotationContext";


const ClientArea = () => {
  const { clients } = useContext(ClientContext);
  const { quotations } = useContext(QuotationContext);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const navi = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredClient, setHoveredClient] = useState(null);

  const hoverTimeout = useRef(null);

  const rowsPerPage = 10;

  useEffect(() => {
    const handleMove = (e) => {
      const target = e.target;

      // if mouse is NOT inside row OR popover → close
      if (
        !target.closest(".client-row") &&
        !target.closest(".popover-content")
      ) {
        hoverTimeout.current = setTimeout(() => {
          setAnchorEl(null);
          setHoveredClient(null);
        }, 200);
      }
    };

    document.addEventListener("mousemove", handleMove);

    return () => {
      document.removeEventListener("mousemove", handleMove);
    };
  }, []);

  const filteredData = clients.filter((item) => {
    const query = search.toLowerCase().trim();

    const matchName = item.cliName?.toLowerCase().includes(query);

    const matchMaterial = quotations
      .filter(q => Number(q.cliId) === Number(item.cliId))
      .some(q =>
        q.materials?.some(m =>
          [m.size, m.gej, m.pic]
            .filter(Boolean)
            .some(field =>
              field.toString().toLowerCase().includes(query)
            )
        )
      );

    return matchName || matchMaterial;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMouseEnter = (event, client) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    setAnchorEl(event.currentTarget);
    setHoveredClient(client);
  };

  const statusMap = {};

  quotations.forEach((q) => {
    const key = Number(q.cliId);

    if (!statusMap[key]) {
      statusMap[key] = { PENDING: 0, CONFIRMED: 0 };
    }

    const status = (q.status || "").toUpperCase();

    if (status === "PENDING") statusMap[key].PENDING++;
    if (status === "CONFIRM") statusMap[key].CONFIRMED++;
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #e2e8f0",
      }}
    >

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >

        {/* 🔹 Title */}
        <Typography variant="h4" fontWeight="bold">
          Clients
        </Typography>

        {/* 🔹 Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >

          {/* Result Count (when searchin g) */}
          {search && (
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: filteredData.length === 0 ? "#fdecea" : "#e6edf7",
                color: filteredData.length === 0 ? "error.main" : "inherit",
                borderRadius: 1,
                fontSize: "15px",
                fontWeight: 500,
                border: "1px solid #cbd5e1",
                whiteSpace: "nowrap",
              }}
            >
              {filteredData.length} result{filteredData.length !== 1 && "s"}
            </Box>
          )}

          {/* 🔍 Search Input */}
          <TextField
            size="small"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 250 }}
            InputProps={{
              endAdornment: search && (
                <Typography
                  sx={{
                    cursor: "pointer",
                    fontSize: "14px",
                    px: 1,
                    color: "text.secondary",
                  }}
                  onClick={() => setSearch("")}
                >
                  ✕
                </Typography>
              ),
            }}
          />

        </Box>
      </Box>

      {/* Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f2f4f5", borderBottom: "2px solid gray" }}>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Total Quotations</TableCell>
                <TableCell>Top Material</TableCell>
                <TableCell>More Detail</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, i) => {

                  return (
                    <TableRow key={item.cliId} hover className="client-row">

                      {/* Index */}
                      <TableCell>{i + 1}</TableCell>

                      {/* Name */}
                      <TableCell>{item.cliName}</TableCell>

                      {/* Mobile No */}
                      <TableCell>{item.mobile}</TableCell>

                      {/* Quotation Counts */}
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>

                          {/* Pending */}
                          <Box
                            sx={{
                              px: 1.2,
                              py: 0.4,
                              borderRadius: 1,
                              bgcolor: "#fef3c7",
                              color: "#92400e",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            P: {statusMap[item.cliId]?.PENDING || 0}
                          </Box>

                          {/* Confirmed */}
                          <Box
                            sx={{
                              px: 1.2,
                              py: 0.4,
                              borderRadius: 1,
                              bgcolor: "#dcfce7",
                              color: "#166534",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            C: {statusMap[item.cliId]?.CONFIRMED || 0}
                          </Box>

                        </Box>
                      </TableCell>

                      {/* Material */}
                      <TableCell
                        onMouseEnter={(e) => handleMouseEnter(e, item)}
                        onMouseLeave={() => {
                          hoverTimeout.current = setTimeout(() => {
                            setAnchorEl(null);
                            setHoveredClient(null);
                          }, 200);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        {
                          quotations
                            .find(q => Number(q.cliId) === Number(item.cliId))
                            ?.materials?.find(m => m.size)?.size || "-"
                        }
                      </TableCell>

                      {/* Detail */}
                      <TableCell>
                        <Typography
                          sx={{
                            color: "primary.main",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => navi(`/clients/${item.cliId}`)}
                        >
                          View Detail →
                        </Typography>
                      </TableCell>

                    </TableRow>
                  );
                })

              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Client Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Paper>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        disableRestoreFocus
        onMouseEnter={() => {
          if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
          }
        }}
        onMouseLeave={() => {
          hoverTimeout.current = setTimeout(() => {
            setAnchorEl(null);
            setHoveredClient(null);
          }, 200);
        }}
        PaperProps={{
          className: "popover-content",
          sx: {
            p: 0,
            borderRadius: 2,
            minWidth: 260,
            boxShadow: 3,
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
          },
        }}
      >
        {hoveredClient && (
          <Box sx={{ p: 1.5 }}>

            {/* Title */}
            <Typography
              fontWeight="600"
              mb={1}
              sx={{ borderBottom: "1px solid #e2e8f0", pb: 0.5 }}
            >
              Materials (All Quotations)
            </Typography>

            {/* List */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {
                quotations
                  .filter(q => Number(q.cliId) === Number(hoveredClient?.cliId))
                  .flatMap(q => q.materials || [])
                  .filter(m => m.size || m.gej || m.pic)
                  .map((m, i) => (
                    <Typography key={i} fontSize="13px">
                      • {m.size || "-"} ({m.gej || "-"}G × {m.pic || 0})
                    </Typography>
                  ))
              }
            </Box>

          </Box>
        )}

      </Popover>

    </Paper>
  );
};

export default ClientArea;