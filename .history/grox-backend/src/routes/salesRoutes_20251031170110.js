// routes/salesRoutes.js
import express from "express";
const router = express.Router();

// Import your Sale model (or however you save sales)
import Sale from "../models/Sale.js"; // adjust path

// POST /api/sales
router.post("/", async (req, res) => {
  try {
    const { items, total, paymentMode } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: "Cart is empty" });

    const newSale = new Sale({ items, total, paymentMode, date: new Date() });
    await newSale.save();

    res.status(201).json({ message: "Sale recorded successfully", sale: newSale });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to record sale" });
  }
});

export default router;
