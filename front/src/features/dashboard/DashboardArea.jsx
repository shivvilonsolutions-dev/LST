import React, { useContext } from "react";
import { Box, Stack } from "@mui/material";
import InventoryCard from "./InventoryCard";
import { InventoryContext } from "../../contexts/inventory/inventoryContext";
import QuotationStats from "../quotation/components/QuotationStats";

const DashboardArea = () => {

  const { inventories } = useContext(InventoryContext)

  return (
    <Box>
      <Stack 
        sx = {{ width: "100%" }}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {inventories.map((item) => (
          <InventoryCard
            key={item.id}
            productName={item.inventoryName}
            property={item.properties}
            productId={item.id}
          />
        ))}
      </Stack>
      
      <Box sx={{ marginTop: "30px" }}>    
        <QuotationStats/>
      </Box>
    </Box>
  );
};

export default DashboardArea;