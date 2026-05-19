import express
from "express";

import {
  login,
  sendOtp,
  resetPassword,
} from "../controllers/authController.js";


const router = express.Router();


router.post(
  "/login",
  login
);

router.post(
  "/send-otp",
  sendOtp
);

router.post(
  "/reset-password",
  resetPassword
);

export default router;