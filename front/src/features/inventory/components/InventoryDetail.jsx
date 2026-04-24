import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import { useContext } from "react";
import { InventoryContext } from "../../../contexts/inventory/inventoryContext";
import Button from "../../../components/ui/Button";
import React from "react";

const InventoryDetail = () => {
  const { id } = useParams();
  const navi = useNavigate();
  const { inventories } = useContext(InventoryContext);

  const inventory = inventories.find(
    (item) => item.id === Number(id)
  );
  
  if (!inventory) return <Typography>Inventory not found</Typography>;

  return (
    <Box>

      {/* 🔝 Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Button
          btnName="← Back"
          btnColor="gray"
          txtCol="black"
          onClick={() => navi("/inventories")}
        />
      </Box>

      {/* 📦 Main Container */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >

        {/* Title */}
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="500"
        >
          Inventory Detail
        </Typography>

        {/* 🔹 Row 1 → Inventory Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
            mb: 3,
            gap: 2
          }}
        >
          <Typography sx={{ width: 140 }}>Inventory Name:</Typography>
          <Box
            sx={{
              flex: 1,
              bgcolor: "#e6edf7",
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            {inventory.inventoryName}
          </Box>

          <Typography>Date:</Typography>
          <Box
            sx={{
              flex: 1,
              bgcolor: "#e6edf7",
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            {inventory.dateOfInventory}
          </Box>
        </Box>

        {/* 🔹 Row 2 → Properties */}
        <Box>

          <Typography mb={2} variant="h5" sx={{ marginBottom: "20px" }}>
            Properties:
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {inventory.properties?.map((prop) => (
              <Box
                key={prop.id}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  pb: 1,
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {[
                  {
                    label: "Thickness",
                    value: prop.thickness ? prop.thickness : "-",
                  },
                  {
                    label: "Quantity",
                    value: prop.quantity || "-",
                  },
                  {
                    label: "Weight",
                    value: prop.weight ? prop.weight : "-",
                  },
                  {
                    label: "Height",
                    value: prop.height ? prop.height : "-",
                  },
                  {
                    label: "Length",
                    value: prop.lengthOfInventory
                      ? prop.lengthOfInventory
                      : "-",
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: "220px",
                      flex: "1 1 220px",
                    }}
                  >
                    <Typography sx={{ width: 90 }}>
                      {item.label}:
                    </Typography>

                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: "#e6edf7",
                        px: 1.5,
                        py: 0.8,
                        borderRadius: 1,
                        textAlign: "center",
                      }}
                    >
                      {item.value}
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>

        </Box>
      </Paper>
    </Box>
  );
};

export default InventoryDetail;