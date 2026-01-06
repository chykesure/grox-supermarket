import mongoose from "mongoose";
import Ledger from "../models/Ledger.js"; // Use your ledger collection
import Product from "../models/Product.js";

export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;
    const { supplierId } = req.query;

    if (!productName)
      return res.status(400).json({ message: "productName is required" });

    const product = await Product.findOne({ name: productName });
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const productId = product._id;

    // 1. Fetch all ledger entries for this product
    const ledgerQuery = { productId };
    if (supplierId)
      ledgerQuery.supplierId = new mongoose.Types.ObjectId(supplierId);

    const ledgerEntries = await Ledger.find(ledgerQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    if (!ledgerEntries.length)
      return res.json({
        product: product.name,
        currentStock: 0,
        ledger: [],
      });

    // 2. Map entries into unified ledger format
    const ledger = ledgerEntries.map((entry) => {
      let type = entry.type === "stock-in" ? "IN" : entry.type === "return" ? "IN" : "OUT";
      let quantityIn = type === "IN" ? entry.quantityAdded : 0;
      let quantityOut = type === "OUT" ? entry.quantityAdded : 0;

      return {
        date: entry.date,
        type,
        referenceNumber: entry.referenceNumber || entry._id.toString(),
        supplierName: entry.supplierId?.name || "—",
        cashier: entry.cashier || entry.processedBy || "—",
        quantityIn,
        quantityOut,
        costPrice: entry.costPrice || 0,
        sellingPrice: entry.sellingPrice || 0,
        note:
          type === "IN"
            ? entry.type === "return"
              ? "Return"
              : "Stock Received"
            : "Sale",
        balanceAfterStock: entry.balanceAfterStock || 0, // optional, for validation
      };
    });

    // 3. Calculate running balance (rebuild from ledger in case balanceAfterStock is missing)
    let runningBalance = 0;
    const finalLedger = ledger.map((entry) => {
      runningBalance += entry.quantityIn - entry.quantityOut;
      return { ...entry, balance: runningBalance };
    });

    return res.json({
      product: product.name,
      currentStock: runningBalance,
      ledger: finalLedger,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
