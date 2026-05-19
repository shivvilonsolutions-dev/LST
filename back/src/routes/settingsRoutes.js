import express from "express";

import {
  getSettings,

  updateSettings,
} from "../controllers/settingsController.js";
import authMiddleware
from "../middleware/authMiddleware.js";


const router =  express.Router();


// GET SETTINGS

router.get(
  "/",
  authMiddleware,
  getSettings
);


// UPDATE SETTINGS

router.post(
  "/",
  authMiddleware,
  updateSettings
);

export default router;