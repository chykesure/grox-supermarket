// routes/salesRoutes.js
import express from "express";
const router = express.Router();

import Sale from "../models/Sale.js";
import Counter from "../models/Counter.js"; // for invoice number tracking

// Helper: Get next sequential invoice number
const getNextInvoiceNumber = async () => {
  let counter = await Counter.findById("invoiceNumber");

  if (!counter) {
    counter = await Counter.create({ _id: "invoiceNumber", seq: 1 });
    return counter.seq;
  }

  counter.seq += 1;
  await counter.save();
  return counter.seq;
};

// POST /api/sales
router.post("/", async (req, res) => {
  try {
    const { items, total, paymentMode } = req.body;

    if (!items || !items.length)
      return res.status(400).json({ message: "Cart is empty" });

    // ✅ Generate invoice number
    const invoiceNumber = await getNextInvoiceNumber();

    // ✅ Create sale with invoice number
    const newSale = new Sale({
      invoiceNumber,
      items,
      total,
      paymentMode,
      date: new Date(),
    });

    await newSale.save();

    res.status(201).json({
      message: "Sale recorded successfully",
      sale: newSale,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to record sale" });
  }
});

export default router;
