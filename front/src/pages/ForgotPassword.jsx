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
  useNavigate,
} from "react-router-dom";

import Input
  from "../components/ui/Input";

import Button
  from "../components/ui/Button";

import Popup
  from "../components/ui/Popup";

import {
  sendOtp,
} from "../api/authApi";


const ForgotPassword =
  () => {

    const navi =
      useNavigate();

    const [email, setEmail] =
      useState("");

    const [popup, setPopup] =
      useState({
        open: false,
        title: "",
        message: "",
      });


    const handleSubmit =
      async (e) => {

        e.preventDefault();

        const response =
          await sendOtp(
            email
          );

        if (response.success) {

          setPopup({
            open: true,

            title: "Success",

            message:
              "OTP sent successfully",
          });


          setTimeout(() => {

            navi(
              "/reset-password",
              {
                state: {
                  email,
                },
              }
            );

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
            Forgot Password
          </Typography>


          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ marginTop: "40px"}}
          >

            <Stack spacing={3}>

              <Input
                inpName="email"
                inpType="email"
                inpPlaceholder="Enter email"
                inpValue={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <Button
                btnName="Send OTP"
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

export default ForgotPassword;