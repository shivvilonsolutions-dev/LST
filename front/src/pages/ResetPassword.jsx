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


const ResetPassword =
  () => {

    const location =
      useLocation();

    const navi =
      useNavigate();


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
            navi("/");
          }, 1500);

        } else {

          setPopup({
            open: true,

            title: "Error",

            message:
              response.message,
          });
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
            sx={{ marginTop: "40px"}}
          >

            <Stack spacing={3}>

              <Input
                inpName="otp"
                inpPlaceholder="Enter OTP"
                inpValue={formData.otp}
                onChange={handleChange}
              />

              <Input
                inpType="password"
                inpName="password"
                inpPlaceholder="Enter new password"
                inpValue={formData.password}
                onChange={handleChange}
              />

              <Button
                btnName="Reset Password"
                btnColor="secondary.main"
                btnType="submit"
                btnWidth="100%"
              />

            </Stack>

          </Box>

        </Paper>


        <Popup
          isOpen={popup.open}
          title={popup.title}
          message={popup.message}
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

export default ResetPassword;