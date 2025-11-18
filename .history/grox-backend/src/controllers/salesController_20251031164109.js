// src/controllers/salesController.js
import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import ProductLedger from "../models/ProductLedger.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc    Create a sale, deduct stock, and update ledger
// @route   POST /api/sales
// @access  Public (no auth)
export const createSale = asyncHandler(async (req, res) => {
  const { items, total, paymentMode } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items in cart");
  }

  // Create Sale record
  const sale = await Sale.create({
    items,
    total,
    paymentMode,
    date: new Date(),
  });

  for (const item of items) {
    // 1️⃣ Find stock
    const stock = await Stock.findOne({ product: item.productId });
    if (!stock) continue;

    // Deduct sold quantity
    stock.quantity -= item.quantity;
    if (stock.quantity < 0) stock.quantity = 0;
    await stock.save();

    // 2️⃣ Record in ProductLedger
    await ProductLedger.create({
      productId: item.productId,
      productName: item.name,
      balanceAfterStock: stock.quantity,
      sellingPrice: item.sellingPrice,
      type: "sale",
      quantitySold: item.quantity,
      paymentMode: paymentMode,
      referenceId: sale._id,
      date: new Date(),
    });

    // Optional: Update product total sold quantity
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { soldQuantity: item.quantity },
    });
  }

  res.status(201).json({
    message: "Sale recorded successfully",
    saleId: sale._id,
  });
});
