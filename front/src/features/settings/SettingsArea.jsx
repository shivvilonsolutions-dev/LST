import React, { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import Input from "../../components/ui/Input";

import {
  getSettings,
  updateSettings,
} from "../../api/settingsApi";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SaveIcon from "@mui/icons-material/Save";

import Button from "../../components/ui/Button";
import Popup from "../../components/ui/Popup";

const SettingsArea = () => {
  const [popup, setPopup] =
    useState({
      open: false,
      title: "",
      message: "",
    });

  const [pdfPath, setPdfPath] =
    useState(
      localStorage.getItem(
        "offline_pdf_path"
      ) || ""
    );

  const fetchSettings =
    async () => {

      try {

        const response = await getSettings();

        if (
          response.data.data
            ?.offlinePdfPath
        ) {

          setPdfPath(
            response.data.data
              .offlinePdfPath
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    const loadSettings =
      async () => {

        await fetchSettings();
      };

    loadSettings();

  }, []);

  const handleSave =
    async () => {

      try {

        await updateSettings({
          offlinePdfPath:
            pdfPath,
        });

        setPopup({
          open: true,

          title: "Success",

          message:
            "PDF save path updated successfully",
        });

      } catch (error) {

        console.log(error);

        setPopup({
          open: true,

          title: "Error",

          message:
            "Failed to save settings",
        });
      }
    };

  const handlePickDirectory =
    async () => {

      try {

        const dirHandle =
          await window.showDirectoryPicker();

        const fullPath =
          dirHandle.name;

        setPdfPath(fullPath);

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <Box
      sx={{
        p: 3,
      }}
    >

      <Typography
        variant="h4"
        fontWeight="bold"
      >
        Settings
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mt={1}
      >
        Configure offline storage and sync preferences.
      </Typography>


      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
        }}
      >

        <Typography
          variant="h6"
          fontWeight={600}
        >
          Offline PDF Storage
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={1}
        >
          Select the folder path where quotation PDFs will be saved locally.
        </Typography>


        <Divider sx={{ my: 3 }} />


        <Stack
          spacing={2}
        >

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >

            <Input
              inpName="pdfPath"
              inpValue={pdfPath}
              inpPlaceholder="Enter alreday created folder path"
              onChange={(e) =>
                setPdfPath(
                  e.target.value
                )
              }
            />

            <Button
              btnName="Browse"
              btnColor="secondary.main"
              btnWidth="auto"
              onClick={handlePickDirectory}
            />

          </Box>

          <Box>

            <Button
              btnName="Save Settings"
              btnColor="primary.main"
              btnWidth="auto"
              icon={<SaveIcon />}
              onClick={handleSave}
            />

          </Box>

        </Stack>

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

export default SettingsArea;