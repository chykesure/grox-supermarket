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

    // 1️⃣ Find product
    const product = await Product.findOne({ name: productName });
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const productId = product._id;

    // 2️⃣ Fetch Ledger entries (stock-in + returns)
    const ledgerQuery = { productId };
    if (supplierId)
      ledgerQuery.supplierId = new mongoose.Types.ObjectId(supplierId);

    const ledgerEntries = await Ledger.find(ledgerQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    // 3️⃣ Map Stock-In and Returns
    const stockDisplayRows = ledgerEntries.map((entry) => {
      const isReturn = entry.type === "return";
      return {
        date: entry.date,
        type: "IN",
        referenceNumber: entry.referenceNumber || entry._id.toString(),
        supplierName: entry.supplierId?.name || (isReturn ? "—" : "Unknown"),
        cashier: isReturn ? entry.processedBy || "—" : "—",
        quantityIn: entry.quantityAdded,
        quantityOut: 0,
        costPrice: entry.costPrice || 0,
        sellingPrice: entry.sellingPrice || 0,
        note: isReturn ? "Return" : "Stock Received",
      };
    });

    // 4️⃣ Prepare FIFO batches for sales
    const fifoBatches = ledgerEntries.map((entry) => ({
      remaining: entry.quantityAdded,
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      supplierName: entry.supplierId?.name || "Unknown",
    }));

    let ledger = [...stockDisplayRows];

    // 5️⃣ Fetch Sales (OUT)
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

    // 6️⃣ Final sort & running balance
    ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBal = 0;
    const finalLedger = ledger.map((entry) => {
      runningBal += (entry.quantityIn || 0) - (entry.quantityOut || 0);
      return { ...entry, balance: runningBal };
    });

    return res.json({ product: product.name, currentStock: runningBal, ledger: finalLedger });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
