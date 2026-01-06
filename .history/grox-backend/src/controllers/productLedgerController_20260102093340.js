import mongoose from "mongoose";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import Ledger from "../models/Ledger.js";

export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;
    const { supplierId } = req.query;

    if (!productName)
      return res.status(400).json({ message: "productName is required" });

    // 1️⃣ Find all products with this name (handle multiple product IDs per name)
    const productDocs = await Product.find({ name: productName });
    if (!productDocs.length)
      return res.status(404).json({ message: "Product not found" });

    const productIds = productDocs.map((p) => p._id);

    // 2️⃣ Fetch all ledger entries (stock-in + return) for these product IDs
    const ledgerQuery = { productId: { $in: productIds } };
    if (supplierId) {
      ledgerQuery.supplierId = new mongoose.Types.ObjectId(supplierId);
    }

    const ledgerEntries = await Ledger.find(ledgerQuery)
      .sort({ date: 1 })
      .populate("supplierId", "name");

    let fifoBatches = [];
    let ledger = [];

    // 3️⃣ Map stock-in and returns
    for (const entry of ledgerEntries) {
      const isReturn = entry.type === "return";

      ledger.push({
        date: entry.date,
        type: "IN", // stock-in and return are IN
        referenceNumber: entry.referenceNumber || entry._id.toString(),
        supplierName: entry.supplierId?.name || (isReturn ? "—" : "Unknown"),
        cashier: isReturn ? entry.processedBy || "—" : "—",
        quantityIn: entry.quantityAdded,
        quantityOut: 0,
        costPrice: entry.costPrice,
        sellingPrice: entry.sellingPrice,
        note: isReturn ? "Return" : "Stock Received",
      });

      // Add to FIFO batches for sales
      fifoBatches.push({
        remaining: entry.quantityAdded,
        costPrice: entry.costPrice,
        sellingPrice: entry.sellingPrice,
        supplierName: entry.supplierId?.name || "Unknown",
      });
    }

    // 4️⃣ Fetch sales (OUT) for these product IDs
    const sales = await Sale.find({
      "items.productId": { $in: productIds },
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

    // 5️⃣ Map sales into ledger
    for (const sale of sales) {
      const relevantItems = sale.items.filter((item) =>
        productIds.includes(item.productId)
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

    // 6️⃣ Sort ledger by date and calculate running balance
    ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBal = 0;
    const finalLedger = ledger.map((entry) => {
      runningBal += (entry.quantityIn || 0) - (entry.quantityOut || 0);
      return { ...entry, balance: runningBal };
    });

    return res.json({
      product: productName,
      currentStock: runningBal,
      ledger: finalLedger,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
