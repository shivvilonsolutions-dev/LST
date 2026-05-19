import express from "express";

import {
  createClient,
  getAllClients,
  getSingleClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import authMiddleware
from "../middleware/authMiddleware.js";

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  createClient
);

router.get(
  "/",
  authMiddleware,
  getAllClients
);

router.get(
  "/:id",
  authMiddleware,
  getSingleClient
);

router.put(
  "/:id",
  authMiddleware,
  updateClient
);

router.delete(
  "/:id",
  authMiddleware,
  deleteClient
);

export default router;