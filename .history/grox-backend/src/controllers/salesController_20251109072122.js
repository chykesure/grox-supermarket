import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import ProductLedger from "../models/ProductLedger.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

const generateInvoiceNumber = () => "INV-" + Date.now();

export const createSale = asyncHandler(async (req, res) => {
  const { items, paymentMode } = req.body;

  if (!items || !items.length) {
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

    const quantity = Number(item.quantity);
    const price = Number(item.price);
    const subtotal = quantity * price;
    total += subtotal;

    saleItems.push({
      productId: item.productId,
      quantity,
      price,
      subtotal,
    });
  }

  const invoiceNumber = generateInvoiceNumber();

  console.log("saleItems", saleItems);
  console.log("total", total);
  console.log("invoiceNumber", invoiceNumber);

  const sale = await Sale.create({
    invoiceNumber,
    items: saleItems,
    total,
    paymentMode,
  });

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
