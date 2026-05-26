import React,
{
  useState,
} from "react";

import {
  Box,
  Paper,
  Typography,
  Stack,
} from "@mui/material";


import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

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
  createUser,
} from "../api/authApi";


const AddUserPage =
  () => {

    const navi =
      useNavigate();

    const [showPassword, setShowPassword] =
      useState(false);

    const [formData,
      setFormData] =
      useState({

        name: "",

        email: "",

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
          await createUser(
            formData
          );


        if (response.success) {

          setPopup({

            open: true,

            title: "Success",

            message:
              "User created successfully.\n\nClick OK to continue.",
          });
        }

        else {

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

          minHeight:
            "100vh",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)",
        }}
      >

        <Paper
          sx={{

            width: "100%",

            maxWidth: 450,

            p: 4,

            borderRadius: 3,
          }}
        >

          <Typography
            variant="h5"

            fontWeight="bold"

            mb={4}

            textAlign="center"
          >
            Add New User
          </Typography>


          <Box
            component="form"
            sx={{ marginTop: "30px" }}
            onSubmit={
              handleSubmit
            }
          >

            <Stack spacing={3}>

              <Box>

                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: "9px"
                  }}
                >
                  New User's Name
                </Typography>

                <Input
                  inpType="text"

                  inpName="name"

                  inpValue={
                    formData.name
                  }

                  inpPlaceholder="Enter Name"

                  onChange={
                    handleChange
                  }

                />

              </Box>


              <Box>

                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: "9px"
                  }}
                >
                  New User's Email
                </Typography>


                <Input
                  inpType="email"

                  inpName="email"

                  inpValue={
                    formData.email
                  }

                  inpPlaceholder="Enter Email"

                  onChange={
                    handleChange
                  }

                  isReq
                />

              </Box>


              <Box>

                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: "9px"
                  }}
                >
                  New User's Password
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
                btnName="Create User"
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
          isOpen={
            popup.open
          }

          title={
            popup.title
          }

          message={
            popup.message
          }

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

              navi("/");
            }
          }}
        />

      </Box>
    );
  };


export default
  AddUserPage;