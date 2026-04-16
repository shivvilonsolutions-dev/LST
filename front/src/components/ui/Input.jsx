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
      inputProps={{
        readOnly: readOnly,
      }}
      sx={{
        width: inpWidth,
        "& .MuiOutlinedInput-root": {
          height: "40px",

          ...(readOnly && {
            pointerEvents: "none",   // 🔥 blocks typing completely
            backgroundColor: "#f8fafc",
          }),
        },
      }}
    />
  );
};

export default Input;