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
          p: 4,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >

        {/* Title */}
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="500"
          mb={4}
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
          }}
        >
          <Typography sx={{ width: 180 }}>
            Inventory Name:
          </Typography>

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
        </Box>

        {/* 🔹 Row 2 → Properties + Right Section */}
        <Grid container spacing={4}>

          {/* LEFT → Properties */}
          <Grid item xs={12} md={7}>

            <Typography mb={2} variant="h5" sx={{ marginBottom: '20px' }}>Properties:</Typography>

            <Grid container spacing={2}>

              {[
                { label: "Thickness", value: inventory.properties.thickness === "" ? "-" : inventory.properties.thickness + " mm" },
                { label: "Weight", value: inventory.properties.weight === "" ? "-" : inventory.properties.weight + " kg" },
                { label: "Height", value: inventory.properties.height === "" ? "-" : inventory.properties.height + " m" },
                { label: "Length", value: inventory.properties.lengthOfInventory === "" ? "-" : inventory.properties.lengthOfInventory + "m" }
              ].map((item) => (
                <Grid item xs={6} key={item.label}>
                  <Box display="flex" alignItems="center" gap={1}>

                    <Typography sx={{ width: 90, marginBottom: "10px" }}>
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
                      {item.value || "-"}
                    </Box>

                  </Box>
                </Grid>
              ))}

            </Grid>
          </Grid>

          {/* RIGHT → Quantity + Category */}
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={15} sx={{justifyContent:"space-around"}}>

              {/* Quantity */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="h5" sx={{ minWidth: 110 }}>
                  Quantity:
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "#e6edf7",
                    px: 2,
                    py: 2.4,
                    borderRadius: 1,
                    fontSize: 25
                  }}
                >
                  {inventory.quantity}
                </Box>
              </Box>

              {/* Category */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="h5" sx={{ minWidth: 110 }}>
                  Category:
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "#e6edf7",
                    px: 2,
                    py: 2.4,
                    borderRadius: 1,
                    fontSize: 25
                  }}
                >
                  {inventory.category || "-"}
                </Box>
              </Box>

            </Stack>
          </Grid>

        </Grid>

      </Paper>
    </Box>
  );
};

export default InventoryDetail;