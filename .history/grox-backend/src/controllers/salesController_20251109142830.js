import asyncHandler from "express-async-handler";
import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import Product from "../models/Product.js";
import ProductLedger from "../models/ProductLedger.js";
import Counter from "../models/Counter.js";
import Sale from "../models/Sale.js";


// -----------------------------
// Get next sequential invoice number
// -----------------------------
// helper or inside controller
const getNextInvoiceNumber = async () => {
  let counter = await Counter.findById("invoiceNumber");

  // If counter doesn't exist, create one
  if (!counter) {
    counter = await Counter.create({ _id: "invoiceNumber", seq: 1 });
    return counter.seq;
  }

  // Increment and return
  counter.seq += 1;
  await counter.save();
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

  // Compute totals
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

  // ✅ Get sequential invoice number
  const invoiceNumber = await getNextInvoiceNumber();

  // ✅ Create sale
  const sale = await Sale.create({
    invoiceNumber,
    items: saleItems,
    total,
    paymentMode,
  });

  // ✅ Deduct stock and update product ledger
  for (const item of saleItems) {
    const stock = await Stock.findOne({ product: item.productId });
    if (stock) {
      stock.quantity = Math.max(stock.quantity - item.quantity, 0);
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

// Example backend route: GET /api/sales/invoice/:invoiceNumber
export const getSaleByInvoice = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const sale = await Sale.findOne({ invoiceNumber });

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Populate product name in each item
    const itemsWithNames = await Promise.all(
      sale.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item._doc, // keep quantity, price, subtotal
          name: product?.name || "Unknown Product",
        };
      })
    );

    res.json({
      ...sale._doc,
      items: itemsWithNames,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
