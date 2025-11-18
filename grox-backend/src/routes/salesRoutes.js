import express from "express";
const router = express.Router();

import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import Product from "../models/Product.js";
import ProductLedger from "../models/ProductLedger.js";
import Counter from "../models/Counter.js";
import { getSaleByInvoice } from "../controllers/salesController.js";

// ------------------------------------------------------
// 🔢 Helper: Get next sequential invoice number
// ------------------------------------------------------
const getNextInvoiceNumber = async () => {
  let counter = await Counter.findById("invoiceNumber");

  if (!counter) {
    counter = await Counter.create({ _id: "invoiceNumber", seq: 1 });
  } else {
    counter.seq += 1;
    await counter.save();
  }

  return counter.seq; // returns 1, 2, 3...
};

// ------------------------------------------------------
// 💰 Create Sale
// ------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { items, paymentMode, cashier } = req.body;

    // Validate required fields
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    if (!paymentMode)
      return res.status(400).json({ message: "Payment mode is required" });
    if (!cashier)
      return res.status(400).json({ message: "Cashier is required" });

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Generate invoice number
    const invoiceNumber = await getNextInvoiceNumber();

    // Create Sale record
    const newSale = await Sale.create({
      invoiceNumber,
      items,
      total,
      paymentMode,
      cashier,
      date: new Date(),
    });

    const ledgerEntries = [];

    // Process each sold item
    for (const item of items) {
      const stock = await Stock.findOne({ productId: item.productId });
      const product = await Product.findById(item.productId);

      if (!stock) {
        return res
          .status(400)
          .json({ message: `Stock not found for product ${item.productId}` });
      }

      // Deduct stock
      stock.quantity = Math.max(stock.quantity - item.quantity, 0);
      stock.stockBalance = stock.quantity;
      await stock.save();

      // Update product sold quantity
      if (product) {
        product.soldQuantity = (product.soldQuantity || 0) + item.quantity;
        await product.save();
      }

      // Create ledger entry
      ledgerEntries.push({
        productId: item.productId,
        productName: product?.name || "Unknown Product",
        balanceAfterStock: stock.stockBalance,
        costPrice: product?.costPrice || 0,
        sellingPrice: item.price,
        type: "sale",
        quantitySold: item.quantity,
        paymentMode,
        referenceId: newSale._id,
        date: new Date(),
      });
    }

    // Insert all ledger entries at once
    if (ledgerEntries.length > 0) {
      await ProductLedger.insertMany(ledgerEntries);
    }

    res.status(201).json({
      message: "Sale recorded successfully, stock updated, ledger entries created",
      saleId: newSale._id,
      invoiceNumber: newSale.invoiceNumber,
    });
  } catch (err) {
    console.error("❌ Error creating sale:", err);
    res
      .status(500)
      .json({ message: "Failed to record sale", error: err.message });
  }
});

// ------------------------------------------------------
// 🔍 Fetch sale by invoice number
// ------------------------------------------------------
router.get("/invoice/:invoiceNumber", getSaleByInvoice);

export default router;
