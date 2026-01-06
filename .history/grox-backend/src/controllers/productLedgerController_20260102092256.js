import mongoose from "mongoose";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import Ledger from "../models/Ledger.js";

export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;

    if (!productName)
      return res.status(400).json({ message: "productName is required" });

    const product = await Product.findOne({ name: productName });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const productId = product._id;

    // 1. Fetch all stock-in and return entries for this product
    const ledgerEntries = await Ledger.find({ productId }).sort({ date: 1 }).populate("supplierId", "name");

    // 2. Map stock-in & returns for display + prepare FIFO batches
    const fifoBatches = [];
    let ledger = [];

    for (const entry of ledgerEntries) {
      const typeLabel = entry.type === "stock-in" ? "IN" : "IN";
      const noteLabel = entry.type === "stock-in" ? "Stock Received" : "Return";

      ledger.push({
        date: entry.date,
        type: typeLabel,
        referenceNumber: entry.referenceNumber || entry._id.toString(),
        supplierName: entry.supplierId?.name || (entry.type === "return" ? "—" : "Unknown"),
        cashier: entry.type === "return" ? entry.processedBy || "—" : "—",
        quantityIn: entry.quantityAdded,
        quantityOut: 0,
        costPrice: entry.costPrice,
        sellingPrice: entry.sellingPrice,
        note: noteLabel,
      });

      // Add to FIFO batches for sales deduction
      fifoBatches.push({
        remaining: entry.quantityAdded,
        costPrice: entry.costPrice,
        sellingPrice: entry.sellingPrice,
        supplierName: entry.supplierId?.name || "Unknown",
      });
    }

    // 3. Fetch sales (OUT) for this product
    const sales = await Sale.find({
      "items.productId": productId,
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    const consumeFromFifo = (quantityNeeded) => {
      const consumed = [];
      let remainingToConsume = quantityNeeded;

      for (const batch of fifoBatches) {
        if (remainingToConsume <= 0) break;
        if (batch.remaining <= 0) continue;

        const take = Math.min(batch.remaining, remainingToConsume);
        batch.remaining -= take;
        remainingToConsume -= take;

        consumed.push({
          quantityOut: take,
          costPrice: batch.costPrice,
          supplierName: batch.supplierName,
        });
      }

      return consumed;
    };

    // 4. Map sales to ledger rows
    for (const sale of sales) {
      const relevantItems = sale.items.filter(
        (item) => item.productId.toString() === productId.toString()
      );

      for (const item of relevantItems) {
        const consumedBatches = consumeFromFifo(item.quantity);
        for (const consumed of consumedBatches) {
          ledger.push({
            date: sale.date,
            type: "OUT",
            referenceNumber: sale.invoiceNumber || sale._id.toString(),
            supplierName: consumed.supplierName,
            cashier: sale.cashier || "—",
            quantityIn: 0,
            quantityOut: consumed.quantityOut,
            costPrice: consumed.costPrice,
            sellingPrice: item.price || 0,
            note: "Sale",
          });
        }
      }
    }

    // 5. Sort ledger by date & calculate running balance
    ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBal = 0;
    const finalLedger = ledger.map((entry) => {
      runningBal += entry.quantityIn - entry.quantityOut;
      return { ...entry, balance: runningBal };
    });

    return res.json({ product: product.name, currentStock: runningBal, ledger: finalLedger });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
