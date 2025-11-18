import asyncHandler from "express-async-handler";
import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import Product from "../models/Product.js";
import ProductLedger from "../models/ProductLedger.js";
import Counter from "../models/Counter.js";

// -----------------------------
// Get next sequential invoice number
// -----------------------------
const getNextInvoiceNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "invoiceNumber",          // counter id
    { $inc: { seq: 1 } },     // increment by 1
    { new: true, upsert: true } // create if not exists
  );
  return counter.seq;
};

// -----------------------------
// Create Sale
// -----------------------------
export const createSale = asyncHandler(async (req, res) => {
  const { items, paymentMode } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  let total = 0;
  const saleItems = [];

  for (const item of items) {
    if (!item.productId || !item.quantity || !item.price) {
      res.status(400);
      throw new Error("Each item must have productId, quantity, and price");
    }

    const subtotal = Number(item.quantity) * Number(item.price);
    total += subtotal;

    saleItems.push({
      productId: item.productId,
      quantity: Number(item.quantity),
      price: Number(item.price),
      subtotal,
    });
  }

  // Get sequential invoice number
  const invoiceNumber = await getNextInvoiceNumber();

  // Create sale
  const sale = await Sale.create({
    invoiceNumber,
    items: saleItems,
    total,
    paymentMode,
  });

  // Deduct stock and update ledger
  for (const item of saleItems) {
    const stock = await Stock.findOne({ product: item.productId });
    if (stock) {
      stock.quantity -= item.quantity;
      if (stock.quantity < 0) stock.quantity = 0;
      await stock.save();
    }

    const product = await Product.findById(item.productId);

    await ProductLedger.create({
      productId: item.productId,
      productName: product?.name || "Unknown",
      balanceAfterStock: stock?.quantity || 0,
      sellingPrice: item.price,
      type: "sale",
      quantitySold: item.quantity,
      paymentMode,
      referenceId: sale._id,
      date: new Date(),
    });

    // Update total sold quantity in product
    if (product) {
      product.soldQuantity = (product.soldQuantity || 0) + item.quantity;
      await product.save();
    }
  }

  res.status(201).json({
    message: "Sale recorded successfully",
    saleId: sale._id,
    invoiceNumber: sale.invoiceNumber,
  });
});
