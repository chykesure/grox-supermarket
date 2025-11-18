// routes/salesRoutes.js
import express from "express";
import { createSale } from "../controllers/saleController.js"; // ✅ import the controller

const router = express.Router();

// ✅ use the controller that generates invoice number
router.post("/", createSale);

export default router;
