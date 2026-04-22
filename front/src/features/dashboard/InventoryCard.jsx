import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const InventoryCard = ({ productName, property }) => {
  return (
    <Card
      elevation={3}
      sx={{
        width: "100%",
        borderRadius: 3,
        textAlign: "center",
        transition: "0.3s",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      
      <CardContent>
        
        {/* Product Name */}
        <Typography variant="h5" fontWeight="bold">
          {productName}
        </Typography>

        {/* Property */}
        <Typography variant="body2" color="text.secondary" mt={1}>
          {property[0]["thickness"]} mm
        </Typography>

        {/* Quantity */}
        <Box
          sx={{
            mt: 2,
            px: 2,
            py: 1,
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            display: "inline-block",
          }}
        >
          <Typography variant="body1">
            Quantity: {property[0]["quantity"]}
          </Typography>
        </Box>

      </CardContent>

    </Card>
  );
};

export default InventoryCard;