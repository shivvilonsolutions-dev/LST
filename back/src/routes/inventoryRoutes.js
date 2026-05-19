import express from "express";

import {
  upsertInventory,
  getAllInventories,
  getSingleInventory,
  deleteInventory,
  deleteProperty,
} from "../controllers/inventoryController.js";
import authMiddleware
from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE / APPEND PROPERTY
router.post(
  "/upsert",
  authMiddleware,
  upsertInventory
);
 
// GET ALL
router.get(
  "/",
  authMiddleware,
  getAllInventories
);

// GET SINGLE
router.get(
  "/:id",
  authMiddleware,
  getSingleInventory
);

// DELETE INVENTORY
router.delete(
  "/:id",
  authMiddleware,
  deleteInventory
);

// DELETE PROPERTY
router.delete(
  "/:inventoryId/property/:propertyId",
  authMiddleware,
  deleteProperty
);

export default router;