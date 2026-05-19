import React from "react";
import { TextField } from "@mui/material";

const Input = ({
  inpType = "text",
  inpName,
  inpValue,
  inpPlaceholder,
  isReq,
  onChange,
  inpWidth = "100%",
  readOnly = false,
  endAdornment
}) => {
  // console.log("Inside the input box - readOnly: ", readOnly);
  
  return (
    <TextField
      type={inpType}
      name={inpName}
      value={inpValue || ""}
      required={isReq}
      onChange={onChange}
      placeholder={inpPlaceholder}
      size="small"
      InputProps={{
        readOnly: readOnly,
        endAdornment: endAdornment,
      }}
      sx={{
        width: inpWidth,
        "& .MuiOutlinedInput-root": {
          height: "40px",

          ...(readOnly && {
            pointerEvents: "none",
            backgroundColor: "#f8fafc",
          }),
        },
      }}
    />
  );
};

export default Input;