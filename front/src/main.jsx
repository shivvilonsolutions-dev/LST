import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import {
  AuthProvider,
} from "./contexts/auth/authContext.jsx";


const theme = createTheme({
  palette: {
    primary: {
      main: "#162660",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#2E69A3",
      contrastText: "#162660",
    },

    background: {
      default: "#F1E4D1",
      paper: "#ffffff",
    },

    text: {
      primary: "#162660",
      secondary: "#5a5a5a",
    },
  },
});

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>

        <App />

      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);