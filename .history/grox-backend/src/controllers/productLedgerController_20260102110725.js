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

    // 1️⃣ Normalize incoming name: trim and collapse multiple spaces
    const normalize = (str) => str.trim().replace(/\s+/g, " ");

    const incomingName = normalize(productName);

    // 2️⃣ Find the actual product (tolerant)
    const product = await Product.findOne({
      name: { $regex: incomingName, $options: "i" },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productNameNormalized = normalize(product.name);  // e.g., "Chicken Flavour Powder 400g"

    // 3️⃣ Create a SUPER tolerant regex: matches even with extra spaces anywhere
    const tolerantRegex = new RegExp(
      productNameNormalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    // 4️⃣ Query Ledger — matches if stored productName contains the clean name (case/space insensitive)
    const ledgerQuery = {
      productName: tolerantRegex,
      type: { $in: ["stock-in", "return"] },
    };

    if (supplierId) {
      if (["null", "undefined", ""].includes(supplierId)) {
        ledgerQuery.supplierId = null;
      } else if (mongoose.Types.ObjectId.isValid(supplierId)) {
        ledgerQuery.supplierId = new mongoose.Types.ObjectId(supplierId);
      }
    }

    console.log("Searching Ledger for productName regex:", tolerantRegex);
    console.log("Incoming name:", incomingName);
    console.log("Product name from DB:", product.name);

    const stockAndReturns = await Ledger.find(ledgerQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    console.log(`✅ Found ${stockAndReturns.length} IN entries`);

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

    // 5️⃣ Sales — also super tolerant
    const sales = await Sale.find({
      $or: [
        { "items.productName": tolerantRegex },
        { "items.productId": product._id },
        { "items.productId": product._id.toString() },
      ],
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    console.log(`Found ${sales.length} sales`);

    for (const sale of sales) {
      const relevantItems = sale.items.filter((item) => {
        const itemName = normalize(item.productName || "");
        return (
          itemName === productNameNormalized ||
          item.productId?.toString() === product._id.toString()
        );
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

    // 6️⃣ Sort & balance
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