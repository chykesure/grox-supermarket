import Stock from "../models/Stock.js";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import SalesReturn from "../models/SalesReturn.js";

// FIFO ledger with IN showing original stock
export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;
    if (!productName) return res.status(400).json({ message: "productName is required" });

    const product = await Product.findOne({ name: productName });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const productId = product._id;

    // 1️⃣ Stock entries (oldest first)
    const stockEntries = await Stock.find({ productId })
      .populate("supplierId", "name")
      .sort({ date: 1 });

    // For display: IN rows always show original quantity
    const stockDisplay = stockEntries.map(entry => ({
      date: entry.date,
      type: "IN",
      referenceNumber: entry.referenceNumber || "—",
      supplierName: entry.supplierId?.name || "Unknown",
      cashier: "—",
      quantityIn: entry.quantity, // original quantity
      quantityOut: 0,
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      note: "Stock In",
    }));

    // For FIFO calculation
    const stockBatches = stockEntries.map(entry => ({
      quantityRemaining: entry.quantity,
      supplierName: entry.supplierId?.name || "Unknown",
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
    }));

    const ledger = [...stockDisplay]; // start with IN rows

    // 2️⃣ Sales entries
    const salesEntries = await Sale.find({
      "items.productId": productId,
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    const consumeStock = (qty) => {
      const consumed = [];
      let remaining = qty;

      for (let batch of stockBatches) {
        if (remaining <= 0) break;
        if (batch.quantityRemaining <= 0) continue;

        const take = Math.min(batch.quantityRemaining, remaining);
        batch.quantityRemaining -= take;
        remaining -= take;

        consumed.push({
          supplierName: batch.supplierName,
          quantityOut: take,
          costPrice: batch.costPrice,
          sellingPrice: batch.sellingPrice,
        });
      }

      return consumed;
    };

    // Add sales rows
    for (let sale of salesEntries) {
      const items = sale.items.filter(i => i.productId.toString() === productId.toString());
      for (let item of items) {
        const consumedBatches = consumeStock(item.quantity);
        for (let c of consumedBatches) {
          ledger.push({
            date: sale.date,
            type: "OUT",
            referenceNumber: sale.invoiceNumber || sale._id.toString(),
            supplierName: c.supplierName,
            cashier: sale.cashier || "—",
            quantityIn: 0,
            quantityOut: c.quantityOut,
            costPrice: c.costPrice,
            sellingPrice: item.price || 0,
            note: "Sale",
          });
        }
      }
    }

    // 3️⃣ Sales returns
    const returnEntries = await SalesReturn.find({ "items.productId": productId }).sort({ date: 1 });
    for (let ret of returnEntries) {
      const items = ret.items.filter(i => i.productId.toString() === productId.toString());
      for (let item of items) {
        ledger.push({
          date: ret.date,
          type: "IN",
          referenceNumber: ret.invoiceNumber || ret._id.toString(),
          supplierName: "—",
          cashier: ret.processedBy || "—",
          quantityIn: item.quantity,
          quantityOut: 0,
          costPrice: product.costPrice || 0,
          sellingPrice: item.price || 0,
          note: `Sales Return (Invoice ${ret.invoiceNumber})`,
        });
      }
    }

    // Sort by date
    const combined = ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Running balance
    let runningBalance = 0;
    const finalLedger = combined.map(entry => {
      if (entry.type === "IN") runningBalance += entry.quantityIn;
      if (entry.type === "OUT") runningBalance -= entry.quantityOut;
      return { ...entry, balanceAfter: runningBalance };
    });

    return res.json(finalLedger);

  } catch (err) {
    console.error("Error fetching product ledger:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
