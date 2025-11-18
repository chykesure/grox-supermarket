import asyncHandler from "express-async-handler";
import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import Product from "../models/Product.js";
import ProductLedger from "../models/ProductLedger.js";
import Counter from "../models/Counter.js";


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

  // ✅ Create sale with cashierName in notes or createdBy
  const sale = await Sale.create({
    invoiceNumber,
    items: saleItems,
    total,
    paymentMode,
    cashier: cashier || "Walk-in", // <-- save cashier
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

export const getSaleByInvoice = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    // Use .lean() to get a plain JS object
    const sale = await Sale.findOne({ invoiceNumber }).lean();

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Populate product names for each item
    const itemsWithNames = await Promise.all(
      sale.items.map(async (item) => {
        const product = await Product.findById(item.productId).lean();
        return {
          productId: item.productId,
          productName: product ? product.name : "Unknown Product",
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        };
      })
    );

    // Return clean object
    res.json({
      _id: sale._id,
      invoiceNumber: sale.invoiceNumber,
      items: itemsWithNames,
      total: sale.total,
      paymentMode: sale.paymentMode,
      date: sale.date,
      status: sale.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const searchSaleByInvoice = asyncHandler(async (req, res) => {
  const { query } = req.params;

  // Case-insensitive partial match
  const sales = await Sale.find({ invoiceNumber: { $regex: query, $options: "i" } }).lean();

  if (!sales || sales.length === 0) return res.status(404).json({ message: "No sales found" });

  // Populate product names
  const results = await Promise.all(
    sales.map(async (sale) => {
      const itemsWithNames = await Promise.all(
        sale.items.map(async (item) => {
          const product = await Product.findById(item.productId).lean();
          return {
            productId: item.productId,
            productName: product ? product.name : "Unknown Product",
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          };
        })
      );

      return {
        _id: sale._id,
        invoiceNumber: sale.invoiceNumber,
        items: itemsWithNames,
        total: sale.total,
        paymentMode: sale.paymentMode,
        date: sale.date,
        status: sale.status,
      };
    })
  );

  res.json(results);
});
