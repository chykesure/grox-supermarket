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

    // 1️⃣ Find the product
    const product = await Product.findOne({ name: productName });
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const productId = product._id;

    // 2️⃣ Fetch stock-in and returns from Ledger
    const ledgerQuery = {
      productId: new mongoose.Types.ObjectId(productId),
      type: { $in: ["stock-in", "return"] },
    };

    // Apply supplier filter safely
    if (supplierId && mongoose.Types.ObjectId.isValid(supplierId)) {
      ledgerQuery.supplierId = new mongoose.Types.ObjectId(supplierId);
    }

    const stockAndReturns = await Ledger.find(ledgerQuery)
      .populate("supplierId", "name")
      .sort({ date: 1 });

    // Map stock-in and returns
    const ledgerEntries = stockAndReturns.map((entry) => ({
      date: entry.date,
      type: "IN",
      referenceNumber: entry.referenceNumber || entry._id.toString(),
      supplierName: entry.supplierId?.name || "—",
      cashier: entry.cashier || entry.processedBy || "—",
      quantityIn: entry.quantityAdded || 0,
      quantityOut: 0,
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      note: entry.type === "stock-in" ? "Stock Received" : "Return",
    }));

    // 3️⃣ Fetch sales for this product from Sale model
    const sales = await Sale.find({
      "items.productId": productId,
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    for (const sale of sales) {
      const relevantItems = sale.items.filter(
        (item) => item.productId.toString() === productId.toString()
      );

      for (const item of relevantItems) {
        ledgerEntries.push({
          date: sale.date,
          type: "OUT",
          referenceNumber: sale.invoiceNumber || sale._id.toString(),
          supplierName: "—",
          cashier: sale.cashier || "—",
          quantityIn: 0,
          quantityOut: item.quantity,
          costPrice: 0, // Optional: implement FIFO if needed
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
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
