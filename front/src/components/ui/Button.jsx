import React from "react";
import { Button as MuiButton } from "@mui/material";

const colorMap = {
  blue: "primary",
  red: "error",
  green: "success",
  yellow: "warning",
  gray: "inherit",
  white: "inherit",
};

const Button = ({
  btnName,
  btnWidth,
  onClick,
  btnColor = "blue",
  btnType = "button",
  txtCol = "white",
}) => {
  const isMuiColor = Object.values(colorMap).includes(btnColor);
  const mappedColor = colorMap[btnColor];

  return (
    <MuiButton
      type={btnType}
      onClick={onClick}
      variant="contained"
      color={isMuiColor ? btnColor : mappedColor || "primary"}
      sx={{
        width: btnWidth || "auto",
        px: 2,
        py: 1,
        textTransform: "none",
        borderRadius: 2,

        // 🔥 Handle custom color like "secondary.main"
        ...(btnColor.includes(".") && {
          bgcolor: btnColor,
          color: txtCol === "black" ? "#000" : "#fff",
          "&:hover": {
            opacity: 0.9,
            bgcolor: btnColor,
          },
        }),

        ...(txtCol === "black" && { color: "#000" }),
      }}
    >
      {btnName}
    </MuiButton>
  );
};

export default Button;