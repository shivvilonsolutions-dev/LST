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
  importQuotationFolder,
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

  const [
    importFolderPath,
    setImportFolderPath
  ] = useState("");


  const [
    importLoading,
    setImportLoading
  ] = useState(false);


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

  const handleImportQuotationFolder =
    async () => {

      try {

        if (
          !importFolderPath
        ) {

          setPopup({

            open: true,

            title: "Error",

            message:
              "Please select import folder",
          });

          return;
        }


        setImportLoading(
          true
        );


        const response =
          await importQuotationFolder(

            importFolderPath
          );


        setImportLoading(
          false
        );


        setPopup({

          open: true,

          title: "Import Completed",

          message:
            response.message,
        });

      }

      catch (error) {

        console.log(error);

        setImportLoading(
          false
        );

        setPopup({

          open: true,

          title: "Error",

          message:
            "Import failed",
        });
      }
    };

  const handlePickDirectory =
    async () => {

      try {

        const result =
          await window.electronAPI
            .selectFolder();

        if (
          !result.canceled &&
          result.filePaths.length > 0
        ) {

          setPdfPath(
            result.filePaths[0]
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  const handlePickImportFolder =
    async () => {

      try {

        const result =
          await window
            .electronAPI
            .selectFolder();

        if (

          !result.canceled &&

          result.filePaths.length > 0
        ) {

          setImportFolderPath(

            result.filePaths[0]
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

    const user =
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

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
        Settings - {user.name}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mt={1}
      >
        Configure offline storage, sync preferences, old data to database.
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

      <Paper
        elevation={0}

        sx={{

          mt: 4,

          p: 3,

          borderRadius: 3,

          border:
            "1px solid #e2e8f0",
        }}
      >

        <Typography
          variant="h6"
          fontWeight={600}
        >
          Import Legacy Quotations
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={1}
        >
          Import old quotation Excel files
          to add your records into Database.
        </Typography>


        <Divider sx={{ my: 3 }} />


        <Stack spacing={2}>

          <Box
            sx={{

              display: "flex",

              gap: 2,

              alignItems: "center",
            }}
          >

            <Input

              inpName="importFolder"

              inpValue={
                importFolderPath
              }

              inpPlaceholder="Select folder containing .xlsx files"

              onChange={(e) =>

                setImportFolderPath(
                  e.target.value
                )
              }
            />


            <Button

              btnName="Browse"

              btnColor="secondary.main"

              btnWidth="auto"

              icon={
                <FolderOpenIcon />
              }

              onClick={
                handlePickImportFolder
              }
            />

          </Box>


          <Box>

            <Button

              btnName={
                importLoading

                  ? "Importing..."

                  : "Start Import"
              }

              btnColor="primary.main"

              btnWidth="auto"

              onClick={
                handleImportQuotationFolder
              }
            />

          </Box>

        </Stack>

      </Paper>

      {importLoading && (

        <Paper

          elevation={6}

          sx={{

            position: "fixed",

            top: "50%",

            left: "50%",

            transform:
              "translate(-50%, -50%)",

            zIndex: 9999,

            p: 4,

            width: 400,

            borderRadius: 3,
          }}
        >

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Importing Quotations
          </Typography>


          <Typography
            mt={2}
          >
            Uploading data to Database...
          </Typography>

          <Typography
            mt={2}
          >
            Please wait...
          </Typography>

        </Paper>
      )}

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