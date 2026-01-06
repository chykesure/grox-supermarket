import mongoose from "mongoose";
import Stock from "../models/Stock.js";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import SalesReturn from "../models/SalesReturn.js";

export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;
    const { supplierId } = req.query;

    if (!productName) {
      return res.status(400).json({ message: "productName is required" });
    }

    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productId = product._id;

    // 1. Fetch Stock Entries (IN)
    const stockQuery = { productId: product._id };
    if (supplierId) {
      stockQuery.supplierId = new mongoose.Types.ObjectId(supplierId);
    }

    const stockEntries = await Stock.find(stockQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    // 2. Map Stock IN rows
    // FIX: We prioritize 'initialQuantity'. If it's a new record, it uses initialQuantity.
    // If it's an old record where initialQuantity is missing, it uses quantity.
    const stockDisplayRows = stockEntries.map((entry) => ({
      date: entry.date,
      type: "IN",
      referenceNumber: entry.referenceNumber || "—",
      supplierName: entry.supplierId?.name || "Unknown",
      cashier: "—",
      quantityIn: entry.initialQuantity || entry.quantity, 
      quantityOut: 0,
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      note: "Stock Received",
    }));

    // 3. Prepare FIFO batches for consumption simulation
    // We MUST use the full original quantity for the simulation to work
    const fifoBatches = stockEntries.map((entry) => ({
      remaining: entry.initialQuantity || entry.quantity, 
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      supplierName: entry.supplierId?.name || "Unknown",
    }));

    let ledger = [...stockDisplayRows];

    // 4. Fetch Sales (OUT)
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
          sellingPrice: batch.sellingPrice,
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

        const totalConsumed = consumedBatches.reduce((sum, c) => sum + c.quantityOut, 0);
        if (totalConsumed < item.quantity) {
          ledger.push({
            date: sale.date,
            type: "OUT",
            referenceNumber: sale.invoiceNumber || sale._id.toString(),
            supplierName: "—",
            cashier: sale.cashier || "—",
            quantityIn: 0,
            quantityOut: item.quantity - totalConsumed,
            costPrice: 0,
            sellingPrice: item.price || 0,
            note: "Sale (Stock Shortage)",
          });
        }
      }
    }

    // 5. Fetch Sales Returns (IN)
    const returns = await SalesReturn.find({
      "items.productId": productId,
    }).sort({ date: 1 });

    for (const ret of returns) {
      const relevantItems = ret.items.filter(
        (item) => item.productId.toString() === productId.toString()
      );

      for (const item of relevantItems) {
        ledger.push({
          date: ret.date,
          type: "IN",
          referenceNumber: ret.referenceNumber || ret.invoiceNumber || ret._id.toString(),
          supplierName: "—",
          cashier: ret.processedBy || "—",
          quantityIn: item.quantity,
          quantityOut: 0,
          costPrice: product.costPrice || 0,
          sellingPrice: item.price || 0,
          note: `Return from Sale`,
        });
      }
    }

    // 6. Final Sort and Running Balance Calculation
    ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    let currentRunningBalance = 0;
    const finalLedger = ledger.map((entry) => {
      if (entry.type === "IN") {
        currentRunningBalance += entry.quantityIn;
      } else {
        currentRunningBalance -= entry.quantityOut;
      }
      return {
        ...entry,
        balance: currentRunningBalance, // This will now show 12 then 8
      };
    });

    return res.json({
      product: product.name,
      currentStock: currentRunningBalance,
      ledger: finalLedger,
    });

  } catch (err) {
    console.error("Error fetching product ledger:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};