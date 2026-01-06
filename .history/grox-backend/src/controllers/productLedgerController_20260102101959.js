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

    // Normalize productName for case-insensitive matching
    const normalizedName = productName.trim();

    // 1️⃣ Validate product exists
    const product = await Product.findOne({
      name: { $regex: `^${normalizedName}$`, $options: "i" },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Fetch IN entries: stock-in and returns from Ledger (using productName)
    const ledgerQuery = {
      productName: { $regex: `^${normalizedName}$`, $options: "i" },
      type: { $in: ["stock-in", "return"] },
    };

    if (supplierId) {
      if (supplierId === "null" || supplierId === "undefined") {
        ledgerQuery.supplierId = null;
      } else if (mongoose.Types.ObjectId.isValid(supplierId)) {
        ledgerQuery.supplierId = new mongoose.Types.ObjectId(supplierId);
      }
    }

    const stockAndReturns = await Ledger.find(ledgerQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    console.log(`Found ${stockAndReturns.length} IN entries for ${normalizedName}`);

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
      balanceAfter: entry.balanceAfterStock, // optional
    }));

    // 3️⃣ Fetch OUT entries: Sales
    // Try multiple ways to match the product in sales (robust)
    const sales = await Sale.find({
      $or: [
        { "items.productName": { $regex: `^${normalizedName}$`, $options: "i" } },
        { "items.productId": product._id },
        { "items.productId": product._id.toString() },
      ],
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    console.log(`Found ${sales.length} sales containing ${normalizedName}`);

    for (const sale of sales) {
      const relevantItems = sale.items.filter((item) => {
        const itemName = item.productName?.toString() || "";
        const itemId = item.productId?.toString() || "";

        return (
          itemName.toLowerCase() === normalizedName.toLowerCase() ||
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

    // 4️⃣ Sort all entries by date
    ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 5️⃣ Calculate running balance
    let runningBalance = 0;
    const finalLedger = ledgerEntries.map((entry) => {
      runningBalance += entry.quantityIn - entry.quantityOut;
      return { ...entry, balance: runningBalance };
    });

    console.log(`Final ledger: ${finalLedger.length} entries, Current stock: ${runningBalance}`);

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