import express from "express";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import ProductLedger from "../models/ProductsLedger.js";

const router = express.Router();

// Generate sequential invoice numbers (1, 2, 3...)
async function generateInvoiceNumber() {
  const lastSale = await Sale.findOne().sort({ invoiceNumber: -1 });
  return lastSale ? lastSale.invoiceNumber + 1 : 1;
}

// POST /api/sales
router.post("/", async (req, res) => {
  try {
    const { items, total, paymentMode } = req.body;

    if (!items || !items.length)
      return res.status(400).json({ message: "Cart is empty" });

    // 1️⃣ Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // 2️⃣ Create the sale
    const newSale = new Sale({
      invoiceNumber,
      items,
      total,
      paymentMode,
      date: new Date(),
    });
    await newSale.save();

    // 3️⃣ For each sold product → add to ProductLedger
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      // Calculate new balance after sale
      const newBalance = Math.max((product.stock || 0) - item.quantity, 0);

      // Record sale in ledger
      const ledgerEntry = new ProductLedger({
        productId: product._id,
        productName: product.productName,
        balanceAfterStock: newBalance,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        type: "sale",
        date: new Date(),
        quantitySold: item.quantity,
        paymentMode,
        referenceId: newSale._id,
      });
      await ledgerEntry.save();

      // Optional: update product stock
      product.stock = newBalance;
      await product.save();
    }

    res.status(201).json({
      message: "Sale recorded successfully and ledger updated",
      sale: newSale,
    });
  } catch (err) {
    console.error("❌ Error creating sale:", err);
    res.status(500).json({ message: "Failed to record sale" });
  }
});

export default router;
