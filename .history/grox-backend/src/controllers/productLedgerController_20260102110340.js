import mongoose from "mongoose";
import Ledger from "../models/Ledger.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;
    const { supplierId } = req.query;

    if (!productName)
      return res.status(400).json({ message: "productName is required" });

    // Clean and normalize the incoming productName
    const cleanName = productName.trim(); // Remove leading/trailing spaces

    // 1️⃣ Find the product in Product collection (tolerant to spaces)
    const product = await Product.findOne({
      name: { $regex: `^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: "i" },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a flexible regex that trims spaces in stored names for matching
    const flexibleRegex = new RegExp(
      "^\\s*" +         // Any leading spaces
      cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + // Escaped product name
      "\\s*$",          // Any trailing spaces
      "i"               // Case insensitive
    );

    // 2️⃣ Fetch IN entries (stock-in & return) — tolerant to extra spaces
    const ledgerQuery = {
      productName: flexibleRegex,
      type: { $in: ["stock-in", "return"] },
    };

    if (supplierId) {
      if (supplierId === "null" || supplierId === "" || supplierId === "undefined") {
        ledgerQuery.supplierId = null;
      } else if (mongoose.Types.ObjectId.isValid(supplierId)) {
        ledgerQuery.supplierId = new mongoose.Types.ObjectId(supplierId);
      }
    }

    const stockAndReturns = await Ledger.find(ledgerQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    console.log(`Found ${stockAndReturns.length} IN entries for "${cleanName}"`);

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

    // 3️⃣ Fetch Sales — also tolerant to spaces in productName
    const sales = await Sale.find({
      $or: [
        { "items.productName": flexibleRegex },
        { "items.productId": product._id },
        { "items.productId": product._id.toString() },
      ],
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    console.log(`Found ${sales.length} sales for "${cleanName}"`);

    for (const sale of sales) {
      const relevantItems = sale.items.filter((item) => {
        const itemName = (item.productName || "").toString().trim();
        const itemId = item.productId?.toString() || "";

        return (
          itemName.toLowerCase() === cleanName.toLowerCase() ||
          itemId === product._id.toString()
        );
      });

      for (const item of relevantItems) {
        ledgerEntries.push({
          date: sale.date || sale.createdAt,
          type: "OUT",
          referenceNumber: sale.invoiceNumber || sale._id.toString(),
          supplierName: "—",
          cashier: sale.cashier || sale.processedBy || "—",
          quantityIn: 0,
          quantityOut: item.quantity || 0,
          costPrice: 0,
          sellingPrice: item.price || item.sellingPrice || 0,
          note: "Sale",
        });
      }
    }

    // 4️⃣ Sort by date
    ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 5️⃣ Running balance
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