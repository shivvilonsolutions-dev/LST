import express from "express";

import {
  createQuotation,
  getAllQuotations,
  getSingleQuotation,
  updateQuotation,
  deleteQuotation,
  downloadQuotationPdf,
  downloadQuotationExcel,
  generateWhatsappPdf,
  updateQuotationStatus
} from "../controllers/quotationController.js";
import authMiddleware
  from "../middleware/authMiddleware.js";

import multer from "multer";

const upload = multer();
const router = express.Router();

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

router.patch(
  "/:quotationNo/status",
  authMiddleware,
  updateQuotationStatus
);

router.get(
  "/:quotationNo/excel",
  authMiddleware,
  downloadQuotationExcel
);

router.get(
  "/:quotationNo/pdf",
  authMiddleware,
  downloadQuotationPdf
);

router.get(
  "/:quotationNo/whatsapp-pdf",
  authMiddleware,
  generateWhatsappPdf
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