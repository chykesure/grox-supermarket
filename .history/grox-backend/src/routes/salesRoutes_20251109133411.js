import express from "express";
const router = express.Router();

import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";
import Product from "../models/Product.js";
import ProductLedger from "../models/ProductsLedger.js";
import Counter from "../models/Counter.js";

// ------------------------------------------------------
// 🔢 Helper: Get next formatted invoice number (INV-0001)
// ------------------------------------------------------
const getNextInvoiceNumber = async () => {
  let counter = await Counter.findById("invoiceNumber");

  if (!counter) {
    counter = await Counter.create({ _id: "invoiceNumber", seq: 1 });
  } else {
    counter.seq += 1;
    await counter.save();
  }

  // Format to 4 digits with leading zeros → INV-0001
  const formatted = `INV-${String(counter.seq).padStart(4, "0")}`;
  return formatted;
};

// ------------------------------------------------------
// 💰 Create Sale
// ------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { items, paymentMode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Generate formatted invoice number
    const invoiceNumber = await getNextInvoiceNumber();

    // Create Sale record
    const newSale = await Sale.create({
      invoiceNumber,
      items,
      total,
      paymentMode,
      date: new Date(),
    });

    // Process each sold item
    for (const item of items) {
      const stock = await Stock.findOne({ product: item.productId });
      const product = await Product.findById(item.productId);

      if (stock) {
        stock.quantity = Math.max(stock.quantity - item.quantity, 0);
        await stock.save();
      }

      // Record to ProductLedger
      await ProductLedger.create({
        productId: item.productId,
        productName: product?.name || "Unknown Product",
        balanceAfterStock: stock?.quantity || 0,
        costPrice: product?.costPrice || 0,
        sellingPrice: item.price,
        type: "sale",
        quantitySold: item.quantity,
        paymentMode,
        referenceId: newSale._id,
        date: new Date(),
      });

      // Update product total sold
      if (product) {
        product.soldQuantity = (product.soldQuantity || 0) + item.quantity;
        await product.save();
      }
    }

    res.status(201).json({
      message: "Sale recorded successfully",
      saleId: newSale._id,
      invoiceNumber: newSale.invoiceNumber,
    });
  } catch (err) {
    console.error("❌ Error creating sale:", err);
    res.status(500).json({ message: "Failed to record sale" });
  }
});

export default router;
