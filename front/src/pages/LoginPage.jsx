import React,
{
  useState,
  useContext,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Popup from "../components/ui/Popup";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../contexts/auth/AuthContext";

const cmp_name = "ARB";


const LoginDataPage =
  () => {

    const navi =
      useNavigate();

    const {
      login,
    } = useContext(
      AuthContext
    );

    const [showPassword, setShowPassword] =
      useState(false);

    const [loginData,
      setLoginData] =
      useState({

        id: "",

        password: "",
      });


    const [popup,
      setPopup] =
      useState({

        open: false,

        title: "",

        message: "",
      });


    const handleChange =
      (e) => {

        setLoginData(
          (prev) => ({

            ...prev,

            [e.target.name]:
              e.target.value,
          })
        );
      };


    const handleSubmit =
      async (e) => {

        e.preventDefault();

        const response =
          await loginUser(
            loginData
          );

        if (response.success) {

          login(response);

          navi(
            "/dashboard"
          );

        } else {

          setPopup({

            open: true,

            title: "Login Failed",

            message:
              response.message,
          });
        }
      };


    return (

      <Box
        sx={{
          minHeight:
            "100vh",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)",

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

            border:
              "1px solid #e2e8f0",

            boxShadow:
              "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >

          {/* Header */}
          <Box
            textAlign="center"
            mb={5}
          >

            <Typography
              variant="h4"

              fontWeight="bold"

              color="text.primary"

              sx={{
                textAlign:
                  "center",
              }}
            >
              Welcome to {cmp_name}
            </Typography>

            <Typography
              variant="h6"

              sx={{
                textAlign:
                  "center",

                color: "black",

                marginBottom:
                  "25px",
              }}
            >
              Login here
            </Typography>

          </Box>


          {/* Form */}
          <Box
            component="form"
            onSubmit={
              handleSubmit
            }
          >

            <Stack
              spacing={2.5}
            >

              <Box>

                <Typography
                  variant="body2"

                  sx={{
                    marginBottom:
                      "5px",
                  }}
                >
                  Email
                </Typography>

                <Input
                  inpType="text"

                  inpName="id"

                  inpValue={
                    loginData.id
                  }

                  inpPlaceholder="Enter your email"

                  isReq

                  onChange={
                    handleChange
                  }
                />

              </Box>

              { /* Password */}
              <Box>

  <Typography
    variant="body2"
    sx={{
      mb: 1,
    }}
  >
    Password
  </Typography>

  <Box
    sx={{
      position: "relative",
    }}
  >

    <TextField
      fullWidth

      size="small"

      variant="outlined"

      type={
        showPassword
          ? "text"
          : "password"
      }

      name="password"

      value={
        loginData.password
      }

      onChange={
        handleChange
      }

      placeholder="Enter your password"
    />

    <IconButton
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }

      sx={{

        position:
          "absolute",

        right: 8,

        top: "50%",

        transform:
          "translateY(-50%)",

        color:
          "#162660",

        zIndex: 10,
      }}
    >

      {showPassword ? (

        <VisibilityOff />

      ) : (

        <Visibility />

      )}

    </IconButton>

  </Box>

</Box>


              {/* Forgot Password */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >

                <Link
                  to="/forgot-password"

                  style={{
                    textDecoration:
                      "none",
                  }}
                >

                  <Typography
                    variant="body2"

                    color="primary"
                  >
                    Forgot Password?
                  </Typography>

                </Link>

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


        {/* Popup */}
        <Popup
          isOpen={
            popup.open
          }

          title={
            popup.title
          }

          message={
            popup.message
          }

          onConfirm={() =>
            setPopup({

              open: false,

              title: "",

              message: "",
            })
          }

          onCancel={() =>
            setPopup({

              open: false,

              title: "",

              message: "",
            })
          }
        />

      </Box>
    );
  };

export default
  LoginDataPage;