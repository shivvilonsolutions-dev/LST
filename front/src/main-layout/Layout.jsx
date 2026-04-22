import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";

// const collapsedWidth = 70;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
        isHovered={isSidebarOpen}
        setIsHovered={setIsSidebarOpen}
      />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          ml: {
            md: isSidebarOpen ? "220px" : "70px",
          },
          transition: "margin 0.3s ease",
        }}
      >
        
        {/* Header */}
        <Header onMenuClick={handleDrawerToggle} />

        {/* Content Area */}
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
};

export default Layout;