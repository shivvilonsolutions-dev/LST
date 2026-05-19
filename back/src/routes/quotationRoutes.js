import express from "express";

import {
  createQuotation,
  getAllQuotations,
  getSingleQuotation,
  updateQuotation,
  deleteQuotation,
  saveQuotationPdfController,
} from "../controllers/quotationController.js";
import authMiddleware
from "../middleware/authMiddleware.js";

import multer from "multer";

const upload = multer();
const router = express.Router();

router.post(
  "/save-pdf",
  authMiddleware,
  upload.single("pdf"),
  saveQuotationPdfController
);

// CREATE
router.post(
  "/",
  authMiddleware,
  createQuotation
);

// GET ALL
router.get(
  "/",
  authMiddleware,
  getAllQuotations
);

// GET SINGLE
router.get(
  "/:id",
  authMiddleware,
  getSingleQuotation
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  updateQuotation
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  deleteQuotation
);

export default router;