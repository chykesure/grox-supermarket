// src/controllers/salesController.js
import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import ProductLedger from "../models/ProductLedger.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// Generate a unique invoice number (simple example)
const generateInvoiceNumber = () => {
  return "INV-" + Date.now(); // e.g., INV-1700000000000
};

// @desc    Create a sale, deduct stock, and update ledger
// @route   POST /api/sales
// @access  Public
export const createSale = asyncHandler(async (req, res) => {
  const { items, paymentMode, tax = 0, discount = 0 } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items in cart");
  }

  // 1️⃣ Calculate subtotal for each item and total
  let total = 0;
  const saleItems = [];

  for (const item of items) {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    saleItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      subtotal,
    });
  }

  total = total + tax - discount;

  // 2️⃣ Create Sale record with unique invoice
  const sale = await Sale.create({
    invoiceNumber: generateInvoiceNumber(),
    items: saleItems,
    total,
    paymentMode,
    tax,
    discount,
    date: new Date(),
  });

  // 3️⃣ Update stock, ledger, and product sold quantity
  for (const item of saleItems) {
    const stock = await Stock.findOne({ product: item.productId });
    if (!stock) continue;

    stock.quantity -= item.quantity;
    if (stock.quantity < 0) stock.quantity = 0;
    await stock.save();

    const product = await Product.findById(item.productId);

    await ProductLedger.create({
      productId: item.productId,
      productName: product?.name || "Unknown",
      balanceAfterStock: stock.quantity,
      sellingPrice: item.price,
      type: "sale",
      quantitySold: item.quantity,
      paymentMode,
      referenceId: sale._id,
      date: new Date(),
    });

    await Product.findByIdAndUpdate(item.productId, {
      $inc: { soldQuantity: item.quantity },
    });
  }

  res.status(201).json({
    message: "Sale recorded successfully",
    saleId: sale._id,
    invoiceNumber: sale.invoiceNumber,
  });
});
