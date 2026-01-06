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

    // 1️⃣ Just validate product exists in Product collection (optional but good)
    const product = await Product.findOne({
      name: { $regex: `^${productName}$`, $options: "i" },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Query Ledger using productName instead of productId
    // This matches how your data is actually stored
    const ledgerQuery = {
      productName: { $regex: `^${productName}$`, $options: "i" },
      type: { $in: ["stock-in", "return"] },
    };

    // Apply supplier filter if provided
    if (supplierId) {
      if (mongoose.Types.ObjectId.isValid(supplierId)) {
        ledgerQuery.supplierId = new mongoose.Types.ObjectId(supplierId);
      } else if (supplierId === "null" || supplierId === "") {
        ledgerQuery.supplierId = null;
      }
    }

    console.log("Ledger Query:", ledgerQuery); // Debug

    const stockAndReturns = await Ledger.find(ledgerQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    console.log(`Found ${stockAndReturns.length} IN entries (stock-in/return)`);

    // Map to ledger format
    const ledgerEntries = stockAndReturns.map((entry) => ({
      date: entry.date,
      type: "IN",
      referenceNumber: entry.referenceNumber || entry._id.toString(),
      supplierName: entry.supplierId?.name || "—",
      cashier: entry.processedBy || "—", // if you have this field
      quantityIn: entry.quantityAdded || 0,
      quantityOut: 0,
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      note: entry.type === "stock-in" ? "Stock Received" : "Return",
      balanceAfter: entry.balanceAfterStock, // optional: show balance after this transaction
    }));

    // 3️⃣ Fetch sales (still use productId from Product)
    const sales = await Sale.find({
      "items.productName": { $regex: `^${productName}$`, $options: "i" }, // if Sale stores productName
      // OR if Sale stores productId from Product:
      // "items.productId": product._id,
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    console.log(`Found ${sales.length} sales`);

    for (const sale of sales) {
      const relevantItems = sale.items.filter(
        (item) =>
          item.productName?.toLowerCase() === productName.toLowerCase() ||
          item.productId?.toString() === product._id.toString()
      );

      for (const item of relevantItems) {
        ledgerEntries.push({
          date: sale.date,
          type: "OUT",
          referenceNumber: sale.invoiceNumber || sale._id.toString(),
          supplierName: "—",
          cashier: sale.cashier || "—",
          quantityIn: 0,
          quantityOut: item.quantity || 0,
          costPrice: 0,
          sellingPrice: item.price || 0,
          note: "Sale",
        });
      }
    }

    // 4️⃣ Sort all entries by date
    ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 5️⃣ Calculate running balance
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