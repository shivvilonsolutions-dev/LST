import express
from "express";

import {
  login,
  sendOtp,
  resetPassword,
  createUser,
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

router.post(
  "/create-user",
  createUser
);

export default router;