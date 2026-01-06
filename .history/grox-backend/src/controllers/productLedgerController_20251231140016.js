import mongoose from "mongoose";
import Stock from "../models/Stock.js";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import SalesReturn from "../models/SalesReturn.js";

/**
 * Get Product Ledger (Stock Movement Report)
 * Shows all IN (stock in + returns) and OUT (sales) with running balance
 * Uses FIFO for cost allocation, but does NOT modify any database records
 */
export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;
    const { supplierId } = req.query; // Optional filter by supplier

    if (!productName) {
      return res.status(400).json({ message: "productName is required" });
    }

    // 1. Find the product
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productId = product._id;

    // 2. Fetch Stock Entries (IN) - these are immutable historical receipts
    const stockQuery = { productId: product._id };
    if (supplierId) {
      stockQuery.supplierId = new mongoose.Types.ObjectId(supplierId);
    }

    const stockEntries = await Stock.find(stockQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 }); // Oldest first for FIFO

    // Prepare display rows for stock IN
    const stockDisplayRows = stockEntries.map((entry) => ({
      date: entry.date,
      type: "IN",
      referenceNumber: entry.referenceNumber || "—",
      supplierName: entry.supplierId?.name || "Unknown",
      cashier: "—",
      quantityIn: entry.quantity,    // Original full quantity received
      quantityOut: 0,
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      note: "Stock Received",
    }));

    // Prepare FIFO batches for consumption simulation (in memory only)
    const fifoBatches = stockEntries.map((entry) => ({
      remaining: entry.quantity, // This will be reduced only in memory
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      supplierName: entry.supplierId?.name || "Unknown",
    }));

    // Start building ledger with all stock IN rows
    let ledger = [...stockDisplayRows];

    // 3. Fetch Sales (OUT)
    const sales = await Sale.find({
      "items.productId": productId,
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    // Helper: Consume from FIFO batches (in memory)
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

      // If not enough stock in batches, it will just consume what exists
      return consumed;
    };

    // Add OUT rows from sales
    for (const sale of sales) {
      const relevantItems = sale.items.filter(
        (item) => item.productId.toString() === productId.toString()
      );

      for (const item of relevantItems) {
        const consumedBatches = consumeFromFifo(item.quantity);

        // Create one OUT row per consumed batch (for accurate costing)
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

        // If sale quantity > available stock in batches, add remaining as OUT with unknown source
        if (consumedBatches.reduce((sum, c) => sum + c.quantityOut, 0) < item.quantity) {
          const shortfall = item.quantity - consumedBatches.reduce((sum, c) => sum + c.quantityOut, 0);
          ledger.push({
            date: sale.date,
            type: "OUT",
            referenceNumber: sale.invoiceNumber || sale._id.toString(),
            supplierName: "—",
            cashier: sale.cashier || "—",
            quantityIn: 0,
            quantityOut: shortfall,
            costPrice: 0,
            sellingPrice: item.price || 0,
            note: "Sale (Stock Shortage)",
          });
        }
      }
    }

    // 4. Fetch Sales Returns (IN again)
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

    // 5. Sort all entries by date
    ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 6. Calculate running balance
    let runningBalance = 0;
    const finalLedger = ledger.map((entry) => {
      if (entry.type === "IN") {
        runningBalance += entry.quantityIn;
      } else if (entry.type === "OUT") {
        runningBalance -= entry.quantityOut;
      }
      return {
        ...entry,
        balanceAfter: runningBalance,
      };
    });

    // Optional: Add current stock summary at the top
    const currentStock = runningBalance;

    return res.json({
      product: product.name,
      currentStock,
      ledger: finalLedger,
    });

  } catch (err) {
    console.error("Error fetching product ledger:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};