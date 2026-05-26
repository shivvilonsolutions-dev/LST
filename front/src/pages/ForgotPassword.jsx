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

    const [loading,
      setLoading] =
      useState(false);

    const [popup, setPopup] =
      useState({
        open: false,
        title: "",
        message: "",
      });

    const handleSubmit =
      async (e) => {

        e.preventDefault();

        setLoading(true);

        const response =
          await sendOtp(
            email
          );

        setLoading(false);

        if (response.success) {

          setPopup({

            open: true,

            title: "Success",

            message:
              "OTP sent successfully.\n\nClick OK to continue.",
          });

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
            sx={{ marginTop: "40px" }}
          >

            <Stack spacing={3}>

              <Box>
                
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mb: 1,
                                  }}
                                >
                                  Enter Email
                                </Typography>
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
</Box>
              <Button
                btnName={
                  loading
                    ? "Sending OTP..."
                    : "Send OTP"
                }
                btnColor="secondary.main"
                btnType="submit"
                btnWidth="100%"
                disabled={loading}
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

          onCancel={() => {

            setPopup({

              open: false,

              title: "",

              message: "",
            });
          }}

          onConfirm={() => {

            setPopup({

              open: false,

              title: "",

              message: "",
            });

            if (
              popup.title ===
              "Success"
            ) {

              navi(
                "/reset-password",
                {
                  state: {
                    email,
                  },
                }
              );
            }
          }}
        />

      </Box>
    );
  };

export default ForgotPassword;