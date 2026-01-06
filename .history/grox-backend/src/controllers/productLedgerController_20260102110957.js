import mongoose from "mongoose";
import Ledger from "../models/Ledger.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

export const getProductLedger = async (req, res) => {
  try {
    let { productName } = req.params;
    const { supplierId } = req.query;

    if (!productName) {
      return res.status(400).json({ message: "productName is required" });
    }

    // Normalize function: trim + collapse multiple spaces
    const normalize = (str) => {
      if (!str) return "";
      return str.toString().trim().replace(/\s+/g, " ");
    };

    const incomingNormalized = normalize(productName);

    // 1. Find the product using tolerant search
    const product = await Product.findOne({
      $or: [
        { name: incomingNormalized },
        { name: { $regex: incomingNormalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productNormalized = normalize(product.name);

    console.log("Incoming:", incomingNormalized);
    console.log("Product name (DB):", product.name);
    console.log("Normalized for matching:", productNormalized);

    // 2. Fetch Ledger entries by normalizing on the fly using MongoDB aggregation
    const ledgerPipeline = [
      {
        $match: {
          type: { $in: ["stock-in", "return"] },
        }
      },
      {
        $addFields: {
          normalizedProductName: {
            $trim: { input: { $replaceAll: { input: "$productName", find: /\s+/g, replacement: " " } } }
          }
        }
      },
      {
        $match: {
          normalizedProductName: productNormalized
        }
      },
      { $sort: { date: 1 } }
    ];

    // Add supplier filter if needed
    if (supplierId && supplierId !== "null" && supplierId !== "") {
      if (mongoose.Types.ObjectId.isValid(supplierId)) {
        ledgerPipeline[0].$match.supplierId = new mongoose.Types.ObjectId(supplierId);
      }
    } else if (supplierId === "null") {
      ledgerPipeline[0].$match.supplierId = null;
    }

    const stockAndReturns = await Ledger.aggregate(ledgerPipeline).populate("supplierId", "name");

    console.log(`FOUND ${stockAndReturns.length} IN entries (stock-in/return)`);

    const ledgerEntries = stockAndReturns.map((entry) => ({
      date: entry.date,
      type: "IN",
      referenceNumber: entry.referenceNumber || entry._id.toString(),
      supplierName: entry.supplierId?.name || "—",
      cashier: entry.processedBy || "—",
      quantityIn: entry.quantityAdded || 0,
      quantityOut: 0,
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      note: entry.type === "stock-in" ? "Stock Received" : "Return",
    }));

    // 3. Sales — normalize item names too
    const sales = await Sale.find({
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    for (const sale of sales) {
      const relevantItems = sale.items.filter((item) => {
        const itemName = normalize(item.productName);
        return itemName === productNormalized ||
               item.productId?.toString() === product._id.toString();
      });

      for (const item of relevantItems) {
        ledgerEntries.push({
          date: sale.date || sale.createdAt,
          type: "OUT",
          referenceNumber: sale.invoiceNumber || sale._id.toString(),
          supplierName: "—",
          cashier: sale.cashier || "—",
          quantityIn: 0,
          quantityOut: item.quantity || 0,
          costPrice: 0,
          sellingPrice: item.price || item.sellingPrice || 0,
          note: "Sale",
        });
      }
    }

    // Sort and balance
    ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBalance = 0;
    const finalLedger = ledgerEntries.map((entry) => {
      runningBalance += entry.quantityIn - entry.quantityOut;
      return { ...entry, balance: runningBalance };
    });

    return res.json({
      product: product.name,
      currentStock: runningBalance,
      ledger: finalLedger,
    });

  } catch (err) {
    console.error("getProductLedger Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};