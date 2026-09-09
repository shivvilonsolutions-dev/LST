import express
from "express";

import {
  login,
  sendOtp,
  resetPassword,
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
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

router.get(
  "/users",
  getAllUsers
);

router.delete(
  "/users/:userId",
  deleteUser
);

router.put(
  "/users/:userId",
  updateUser
);

export default router;