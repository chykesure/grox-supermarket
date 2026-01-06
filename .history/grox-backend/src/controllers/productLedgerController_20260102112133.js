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

    // Decode URL encoding (e.g., %20 → space, + → space)
    productName = decodeURIComponent(productName.trim());

    // Normalize: trim, collapse spaces, lowercase for comparison
    const normalize = (str) => {
      if (!str) return "";
      return str.toString()
        .trim()
        .replace(/\s+/g, " ")          // collapse spaces
        .replace(/\s*\*\s*/g, " * ")    // " * " or "*" or "* " → " * "
        .replace(/\s*[xX]\s*/g, " * ") // " x " or " X " or "x" → " * "
        .toLowerCase();
    };

    const incomingNormalized = normalize(productName);

    console.log("Incoming productName (decoded):", productName);
    console.log("Normalized incoming:", incomingNormalized);

    // 1. Find product (tolerant)
    const product = await Product.findOne({
      $or: [
        { name: { $regex: `^${productName}$`, $options: "i" } },
        { name: { $regex: incomingNormalized, $options: "i" } },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productNormalized = normalize(product.name);
    console.log("Product found in DB:", product.name);
    console.log("Product normalized:", productNormalized);

    // 2. Build base filter for Ledger
    const ledgerFilter = {
      type: { $in: ["stock-in", "return"] },
    };

    // Supplier filter
    if (supplierId && supplierId !== "null" && supplierId !== "undefined" && supplierId !== "") {
      if (mongoose.Types.ObjectId.isValid(supplierId)) {
        ledgerFilter.supplierId = new mongoose.Types.ObjectId(supplierId);
      }
    } else if (supplierId === "null" || supplierId === "undefined") {
      ledgerFilter.supplierId = null;
    }

    // Fetch all relevant ledger entries + populate supplier
    const allStockEntries = await Ledger.find(ledgerFilter)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    // Filter in memory using normalized productName
    const stockAndReturns = allStockEntries.filter((entry) => {
      const entryNormalized = normalize(entry.productName);
      return entryNormalized === productNormalized;
    });

    console.log(`✅ FOUND ${stockAndReturns.length} matching IN entries (stock-in/return)`);

    // Map to ledger format
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

    // 3. Sales - normalize in memory
    const sales = await Sale.find({
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    for (const sale of sales) {
      const relevantItems = sale.items.filter((item) => {
        const itemNameNorm = normalize(item.productName || "");
        const idMatch = item.productId?.toString() === product._id.toString();
        return itemNameNorm === productNormalized || idMatch;
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

    // 4. Sort all entries by date
    ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 5. Running balance
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