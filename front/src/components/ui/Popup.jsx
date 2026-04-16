import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import Button from "./Button";

const Popup = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} maxWidth="sm" fullWidth>
      
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Typography color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          btnName="Cancel"
          btnColor="gray"
          txtCol="black"
          onClick={onCancel}
        />

        <Button
          btnName="OK"
          btnColor="blue"
          onClick={onConfirm}
        />
      </DialogActions>

    </Dialog>
  );
};

export default Popup;