import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#162660",        // 🔥 Royal Blue
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#2E69A3",        // 🔥 Powder Blue
      contrastText: "#162660",
    },

    background: {
      default: "#F1E4D1",     // 🔥 Bone (app background)
      paper: "#ffffff",
    },

    text: {
      primary: "#162660",
      secondary: "#5a5a5a",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);