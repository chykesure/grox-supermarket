import Stock from "../models/Stock.js";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import SalesReturn from "../models/SalesReturn.js";

// FIFO batch-aware product ledger (IN shows original quantity)
export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;
    if (!productName) return res.status(400).json({ message: "productName is required" });

    const product = await Product.findOne({ name: productName });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const productId = product._id;

    // 1️⃣ Stock-In entries (oldest first)
    const stockEntries = await Stock.find({ productId })
      .populate("supplierId", "name")
      .sort({ date: 1 });

    // Track remaining quantities per batch for FIFO
    const stockBatches = stockEntries.map(entry => ({
      id: entry._id.toString(),
      date: entry.date,
      quantityRemaining: entry.quantity,
      originalQuantity: entry.quantity, // preserve original for IN display
      referenceNumber: entry.referenceNumber || "—",
      supplierName: entry.supplierId?.name || "Unknown",
      costPrice: entry.costPrice || 0,
      sellingPrice: entry.sellingPrice || 0,
      note: "Stock In",
    }));

    const ledger = [];

    // 2️⃣ Sales entries
    const salesEntries = await Sale.find({
      "items.productId": productId,
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    // Consume stock batches FIFO
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

    // 3️⃣ Add stock-in rows (show original quantity)
    for (let batch of stockBatches) {
      ledger.push({
        date: batch.date,
        type: "IN",
        referenceNumber: batch.referenceNumber,
        supplierName: batch.supplierName,
        cashier: "—",
        quantityIn: batch.originalQuantity, // always original quantity
        quantityOut: 0,
        costPrice: batch.costPrice,
        sellingPrice: batch.sellingPrice,
        note: batch.note,
      });
    }

    // 4️⃣ Add sales (OUT) rows
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

    // 5️⃣ Add returns (IN)
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

    // 6️⃣ Sort by date
    const combined = ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 7️⃣ Calculate running balance
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
