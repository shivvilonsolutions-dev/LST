import React, {useContext} from "react";

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

import {
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../../contexts/auth/AuthContext";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from '@mui/icons-material/Payment';

const expandedWidth = 220;
const collapsedWidth = 70;

const navItems = [

  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },

  {
    label: "Quotation",
    path: "/quotations",
    icon: <ReceiptLongIcon />,
  },

  {
    label: "Client",
    path: "/clients",
    icon: <GroupsIcon />,
  },

  // {
  //   label: "Inventory",
  //   path: "/inventories",
  //   icon: <InventoryIcon />,
  // },

  // {
  //   label: "Payments",
  //   path: "/payment",
  //   icon: <PaymentIcon />,
  // },

  {
    label: "Settings",
    path: "/settings",
    icon: <SettingsIcon />,
  },
];

const Sidebar = ({
  mobileOpen,
  onClose,
  showText,
  setIsHovered,
}) => {

  const theme =
    useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down("md")
    );

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    logout,
  } = useContext(
    AuthContext
  );

  const shouldShowText =
    isMobile || showText;

  const drawerContent = (

    <Box
      sx={{
        height: "100%",

        display: "flex",

        flexDirection:
          "column",

        bgcolor:
          "#f8fafc",
      }}
    >

      {/* LOGO */}
      <Box
        sx={{
          p: 2,

          textAlign:
            shouldShowText
              ? "left"
              : "center",
        }}
      >

        {shouldShowText ? (

          <>

            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Shivvilon Solutions
            </Typography>

            <Typography
              variant="caption"

              color="text.secondary"
            >
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

      {/* NAVIGATION */}
      <List>

        {navItems.map(
          (item) => {

            const isActive =
              location.pathname.startsWith(
                item.path
              );

            return (

              <React.Fragment
                key={item.path}
              >

                {item.path ===
                  "/settings" && (

                    <Divider
                      sx={{
                        my: 1,
                      }}
                    />
                  )}

                <ListItemButton

                  onClick={() =>
                    navigate(
                      item.path
                    )
                  }

                  disableRipple

                  sx={{
                    width: "100%",

                    px:
                      shouldShowText
                        ? 3
                        : 1.5,

                    py: 1.5,

                    justifyContent:
                      shouldShowText
                        ? "flex-start"
                        : "center",

                    color: isActive
                      ? "primary.main"
                      : "text.secondary",

                    transition:
                      "all 0.2s ease",

                    ...(isActive && {

                      bgcolor:
                        "#dbe4ff",

                      fontWeight: 600,

                      borderRight:
                        "4px solid #162660",
                    }),

                    "&:hover": {

                      bgcolor:
                        "#eef2ff",

                      color:
                        "primary.main",
                    },

                    "& .MuiListItemIcon-root": {

                      color:
                        "inherit",

                      minWidth: 0,

                      mr:
                        shouldShowText
                          ? 2
                          : 0,

                      justifyContent:
                        "center",
                    },
                  }}
                >

                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>

                  {shouldShowText && (

                    <ListItemText
                      primary={
                        item.label
                      }

                      primaryTypographyProps={{
                        fontSize: 15,

                        fontWeight:
                          isActive
                            ? 600
                            : 500,
                      }}
                    />
                  )}

                </ListItemButton>
              </React.Fragment>
            );
          }
        )}

      </List>

      {/* SPACER */}
      <Box
        sx={{
          flexGrow: 1,
        }}
      />

      <Divider />

      {/* LOGOUT */}
      <Box sx={{ p: 1 }}>

        <ListItemButton
          onClick={() => {

            logout();

            navigate("/");
          }}

          sx={{
            px:
              shouldShowText
                ? 2
                : 1.5,

            justifyContent:
              shouldShowText
                ? "flex-start"
                : "center",

            transition:
              "all 0.2s ease",

            "&:hover": {

              bgcolor:
                "error.main",

              color:
                "white",
            },

            "& .MuiListItemIcon-root": {

              color:
                "inherit",

              minWidth: 0,

              mr:
                shouldShowText
                  ? 2
                  : 0,

              justifyContent:
                "center",
            },
          }}
        >

          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>

          {shouldShowText && (
            <ListItemText
              primary="Logout"
            />
          )}

        </ListItemButton>

      </Box>

    </Box>
  );

  return (

    <>

      {/* MOBILE */}
      <Drawer
        variant="temporary"

        open={mobileOpen}

        onClose={onClose}

        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width:
              expandedWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP */}
      <Drawer
        variant="permanent"

        open

        onMouseEnter={() =>
          setIsHovered(true)
        }

        onMouseLeave={() =>
          setIsHovered(false)
        }

        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          "& .MuiDrawer-paper": {

            width:
              shouldShowText
                ? expandedWidth
                : collapsedWidth,

            overflowX:
              "hidden",

            transition:
              "all 0.3s ease",

            borderRight:
              "1px solid #eee",
          },
        }}
      >

        {drawerContent}

      </Drawer>

    </>
  );
};

export default Sidebar;