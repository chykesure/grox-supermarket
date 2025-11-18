// src/controllers/salesController.js
import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import ProductLedger from "../models/ProductLedger.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// Generate a unique invoice number
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

  // Build items array with subtotal, fetching price from Product if missing
  const saleItems = [];
  let total = 0;

  for (const item of items) {
    if (!item.productId || !item.quantity) {
      res.status(400);
      throw new Error("Each item must have productId and quantity");
    }

    // Fetch product to get price if not provided
    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }

    const price = item.price ?? product.sellingPrice; // use price from body or Product model
    const subtotal = price * item.quantity;
    total += subtotal;

    saleItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price,
      subtotal,
    });
  }

  // Apply tax and discount
  total = total + tax - discount;

  // Create Sale record
  const sale = await Sale.create({
    invoiceNumber: generateInvoiceNumber(),
    items: saleItems,
    total,
    paymentMode,
    tax,
    discount,
    date: new Date(),
  });

  // Update stock, product ledger, and sold quantity
  for (const item of saleItems) {
    const stock = await Stock.findOne({ product: item.productId });
    if (!stock) continue;

    // Deduct sold quantity
    stock.quantity -= item.quantity;
    if (stock.quantity < 0) stock.quantity = 0;
    await stock.save();

    // Record in ProductLedger
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

    // Update total sold quantity
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
