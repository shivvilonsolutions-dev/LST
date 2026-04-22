import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";

const getTitle = (path) => {
  if (path.startsWith("/quotations/send-quotation")) return "Send Quotation";
  if (path.startsWith("/quotations/")) return "Quotation Detail";
  if (path.startsWith("/quotations")) return "Quotations";

  if (path.startsWith("/inventories/new-inventory")) return "New Inventory";
  if (path.startsWith("/inventories/")) return "Inventory Detail";
  if (path.startsWith("/inventories")) return "Inventories";

  if (path.startsWith("/payment")) return "Payment";
  if (path.startsWith("/dashboard")) return "Dashboard";

  return "Dashboard";
};

const Header = ({ onMenuClick }) => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main", borderRadius: "10px", overflow: "hidden" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 64}}>
        
          {/* Hamburger */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { md: "none" } }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold" }}
          >
            {getTitle(location.pathname)}
          </Typography>

      </Toolbar>
    </AppBar>
  );
};

export default Header;