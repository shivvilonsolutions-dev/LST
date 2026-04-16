import React, { useState } from "react";
import {
  Drawer,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";

import { useLocation, useNavigate } from "react-router-dom";

const expandedWidth = 220;
const collapsedWidth = 70;

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Quotation", path: "/quotations", icon: <ReceiptLongIcon /> },
  { label: "Inventory", path: "/inventories", icon: <InventoryIcon /> },
  { label: "Payment", path: "/payment", icon: <PaymentsIcon /> },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8fafc",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 2, textAlign: isHovered ? "left" : "center" }}>
        {isHovered ? (
          <>
            <Typography variant="h6" fontWeight="bold">
              Shivvilon Solutions
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dashboard Panel
            </Typography>
          </>
        ) : (
          <img
            src="/company-logo/shivvilon_solutions_logo-removebg-preview.png"
            alt="logo"
            width={40}
          />
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              disableRipple
              sx={{
                width: "100%",
                px: isHovered ? 3 : 1.5,
                py: 1.5,
                justifyContent: isHovered ? "flex-start" : "center",

                color: isActive ? "primary.main" : "text.secondary",

                ...(isActive && {
                  bgcolor: "#BEC2CF",
                  fontWeight: 600,
                }),

                "&:hover": {
                  bgcolor: "#E1E2E8",
                  color: "primary.main",
                },

                "& .MuiListItemIcon-root": {
                  color: "inherit",
                  minWidth: 0,
                  mr: isHovered ? 2 : 0,
                  justifyContent: "center",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              {isHovered && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={() => navigate("/")}
          sx={{
            px: isHovered ? 2 : 1.5,
            justifyContent: isHovered ? "flex-start" : "center",

            "&:hover": {
              bgcolor: "error.light",
              color: "white",
            },

            "& .MuiListItemIcon-root": {
              color: "inherit",
              minWidth: 0,
              mr: isHovered ? 2 : 0,
              justifyContent: "center",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>

          {isHovered && <ListItemText primary="Logout" />}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile (unchanged) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: expandedWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop (UPDATED) */}
      <Drawer
        variant="permanent"
        open
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: isHovered ? expandedWidth : collapsedWidth,
            overflowX: "hidden",
            transition: "all 0.3s ease",
            borderRight: "1px solid #eee",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;