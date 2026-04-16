import React, { useContext } from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { InventoryContext } from "../../contexts/inventory/inventoryContext";
import Button from "../../components/ui/Button";

const InventoryArea = () => {
  const { inventories } = useContext(InventoryContext);
  // console.log(inventories)
  const navi = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #e2e8f0",
      }}
    >
      
      <Box
        sx={{
          display :"flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}
      >

      {/* Header */}
      <Typography variant="h4" fontWeight="bold">
        Inventories
      </Typography>
      
        <Button 
          btnName={"+ New inventory"}
          btnColor="secondary.main"
          onClick={() => navi("/inventories/new-inventory")}
        />
          
      </Box>

      {/* Table */}
      <TableContainer>
        <Table
          sx={{
            tableLayout: "fixed",
            "& th, & td": {
              p: "6px",
            },
          }}
        >
          <TableHead sx={{ bgcolor: "#f2f4f5", fontWeight: "bold"}}>
            <TableRow>
              <TableCell sx={{ width: "10%" }}>ID</TableCell>
              <TableCell sx={{ width: "30%" }}>Name</TableCell>
              <TableCell sx={{ width: "20%" }}>Thickness</TableCell>
              <TableCell sx={{ width: "20%" }}>Quantity</TableCell>
              <TableCell sx={{ width: "20%" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventories.map((item, i) => (
              <TableRow
                key={item.id}
                hover
              >
                <TableCell>{i+1}</TableCell>

                <TableCell>{item.inventoryName}</TableCell>

                <TableCell>{item.properties.thickness} mm</TableCell>

                <TableCell>{item.quantity}</TableCell>

                {/* Action */}
                <TableCell>
                  <Typography
                    sx={{
                      color: "primary.main",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() => navi(`/inventories/${item.id}`)}
                  >
                    View Detail →
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryArea;