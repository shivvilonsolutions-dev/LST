import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const cmp_name = "ARB";

const LoginDataPage = () => {
  const navi = useNavigate();

  const [loginData, setLoginData] = useState({
    id: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", loginData);
    navi("dashboard");
  };

  return (
    <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
      px: 2,
    }}
  >
    
    <Paper
      elevation={0}
      sx={{
        p: 4,
        width: "100%",
        maxWidth: 450,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      
      {/* Header */}
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="text.primary"
          sx = {{ textAlign: "center" }}
        >
          Welcome to {cmp_name}
        </Typography>

        <Typography
         variant="h6"
          sx = {{ textAlign: "center", color: "blue", marginBottom: "25px" }}
        >
          Login here
        </Typography>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit}>
        
        <Stack spacing={2.5}>
          
          <Box>
            <Typography variant="body2" sx={{marginBottom: "5px"}}>
              Email
            </Typography>
            <Input
              inpType="text"
              inpName="id"
              inpValue={loginData.id}
              inpPlaceholder="Enter your email"
              isReq
              onChange={handleChange}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{marginBottom: "5px"}}>
              Password
            </Typography>
            <Input
              inpType="password"
              inpName="password"
              inpValue={loginData.password}
              inpPlaceholder="Enter your password"
              isReq
              onChange={handleChange}
            />
          </Box>

          {/* Login Button */}
          <Button
            btnName="Login"
            btnColor="secondary.main"
            btnWidth="100%"
            btnType="submit"
          />

        </Stack>

      </Box>

    </Paper>
  </Box>
  );
};

export default LoginDataPage;