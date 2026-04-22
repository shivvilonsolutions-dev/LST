import React, { useContext, useState } from "react";
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
import { InventoryContext } from "../../contexts/inventory/inventoryContext";
import Button from "../../components/ui/Button";
import Popup from "../../components/ui/Popup";
import { } from "@mui/material";


const InventoryArea = () => {
  const { inventories, setInventories } = useContext(InventoryContext);
  const [showPopUp, setShowPopUp] = useState(false)
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(null)
  const [selectedMap, setSelectedMap] = useState({});
  const [search, setSearch] = useState("");
  const navi = useNavigate();
  const rowsPerPage = 10;
  
  const paginatedData = inventories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const filteredData = paginatedData.filter((item) => {
    const query = search.toLowerCase();

    const matchName = item.inventoryName.toLowerCase().includes(query);

    const matchProperties = item.properties?.some((prop) =>
      prop.thickness?.toString().includes(query)
    );

    return matchName || matchProperties;
  });

  const handleDelete = (deleteId) => {
    const updated = inventories.filter((item) =>
      item.id !== deleteId
    )

    setInventories(updated)
    setShowPopUp(false)
  }

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
          marginBottom: "16px"
        }}
      >

        <Typography variant="h4" fontWeight="bold">
          Inventories
        </Typography>

        {/* Actions */}
        <Box sx={{display: "flex", gap: "15px"}}>
          <TextField
            size="small"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            btnName={"+ New inventory"}
            btnColor="secondary.main"
            onClick={() => navi("/inventories/new-inventory")}
          />
        </Box>

      </Box>

      {/* Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f2f4f5", borderBottom: "2px solid gray"  }}>
              <TableRow hover >
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Thickness</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Detail</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => {

                  // const hasMultiple = item.properties?.length > 1;
                  const hasMultiple = false;

                  return (
                    <TableRow key={item.id} hover>

                      {/* Index */}
                      <TableCell>{i + 1}</TableCell>

                      {/* Name */}
                      <TableCell>{item.inventoryName}</TableCell>

                      {/* Thickness */}
                      <TableCell>

                        {hasMultiple ? (
                          <Select
                            size="small"
                            value={
                              selectedMap[item.id] ||
                              item.properties?.[0]?.thickness
                            }
                            onChange={(e) =>
                              setSelectedMap((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            sx={{ minWidth: 100 }}
                          >
                            {item.properties.map((prop) => (
                              <MenuItem key={prop.thickness} value={prop.thickness}>
                                {prop.thickness}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          `${item.properties?.[0]?.thickness || "-"}`
                        )}
                      </TableCell>

                      {/* Quantity */}
                      <TableCell sx={{ fontSize: "18px" }}>
                        {hasMultiple
                          ? item.properties.find(
                            (p) =>
                              p.thickness ===
                              (selectedMap[item.id] ||
                                item.properties?.[0]?.thickness)
                          )?.quantity
                          : item.properties?.[0]?.quantity}
                      </TableCell>

                      {/* Delete */}
                      <TableCell>
                        <Typography
                          sx={{
                            color: "#f74d6c",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => {
                            setShowPopUp(true);
                            setSelectedId(item.id);
                          }}
                        >
                          Delete
                        </Typography>
                      </TableCell>

                      {/* Detail */}
                      <TableCell>
                        <Typography
                          sx={{
                            color: "primary.main",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => navi(`/inventories/${item.id}`)}
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
                    No Inventory Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={inventories.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Paper>

      {/* Popup Delete Quotation */}
      <Popup
        isOpen={showPopUp}
        title="Delete Quotation"
        message="Are you sure you want to delete this quotation?"
        onConfirm={() => {
          handleDelete(selectedId)
        }}
        onCancel={() => {
          setShowPopUp(false);
          setSelectedId(null);
        }}
      />

    </Paper>
  );
};

export default InventoryArea;