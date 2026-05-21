import {
  useState,
} from "react";

import {
  Box,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Input
  from "../components/ui/Input";

import Button
  from "../components/ui/Button";

import Popup
  from "../components/ui/Popup";

import {
  resetPassword,
} from "../api/authApi";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";


const ResetPassword =
  () => {

    const location =
      useLocation();

    const navi =
      useNavigate();

    const [showPassword, setShowPassword] =
      useState(false);

    const email =
      location.state?.email || "";


    const [formData, setFormData] =
      useState({
        otp: "",
        password: "",
      });


    const [popup, setPopup] =
      useState({
        open: false,
        title: "",
        message: "",
      });

    const handleChange =
      (e) => {

        setFormData({
          ...formData,
          [e.target.name]:
            e.target.value,
        });
      };


    const handleSubmit =
      async (e) => {

        e.preventDefault();

        const response =
          await resetPassword({
            email,
            otp:
              formData.otp,
            password:
              formData.password,
          });

        if (response.success) {

          setPopup({
            open: true,

            title: "Success",

            message:
              "Password updated successfully",
          });


          setTimeout(() => {

            setPopup({

              open: false,

              title: "",

              message: "",
            });

            navi("/");

          }, 2000);

        } else {

          setPopup({
            open: true,

            title: "Error",

            message:
              response.message,
          });

          setTimeout(() => {

            setPopup({

              open: false,

              title: "",

              message: "",
            });

          }, 2000);
        }
      };

    return (

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)",
        }}
      >

        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 450,
          }}
        >

          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
          >
            Reset Password
          </Typography>


          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ marginTop: "40px" }}
          >

            <Stack spacing={3}>

              <Input
                inpName="otp"
                inpPlaceholder="Enter OTP"
                inpValue={formData.otp}
                onChange={handleChange}
              />

              {/* New Password */}

              <Box>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                  }}
                >
                  New Password
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

                    value={formData.password}

                    onChange={handleChange}

                    placeholder="Enter new password"
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

              <Button
                btnName="Reset Password"
                btnColor="secondary.main"
                btnType="submit"
                btnWidth="100%"
              />

              <Button
                btnName="← Back"
                btnColor="gray"
                txtCol="black"
                onClick={() => navi("/")}
              />

            </Stack>

          </Box>

        </Paper>


        <Popup
          isOpen={popup.open}
          title={popup.title}
          message={popup.message}
        />

      </Box>
    );
  };

export default ResetPassword;