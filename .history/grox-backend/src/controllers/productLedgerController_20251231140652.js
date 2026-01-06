import Ledger from "../models/Ledger.js";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import SalesReturn from "../models/SalesReturn.js";

// Get combined Product Ledger by productName
export const getProductLedger = async (req, res) => {
  try {
    const { productName } = req.params;
    if (!productName) return res.status(400).json({ message: "productName is required" });

    const product = await Product.findOne({ name: productName });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const productId = product._id;

    // 1️⃣ Stock-In from Ledger
    const ledgerEntries = await Ledger.find({ productName })
      .populate("supplierId", "name")
      .sort({ date: 1 });

    const formattedStockIns = ledgerEntries
      .map(entry => ({
        date: entry.date,
        type: "IN",
        referenceNumber: entry.referenceNumber || "—",
        supplierName: entry.supplierId?.name || "—",
        cashier: "—",
        quantityIn: entry.quantityAdded || 0,
        quantityOut: 0,
        costPrice: entry.costPrice || 0,
        sellingPrice: entry.sellingPrice || 0,
        note: entry.note || "Stock In",
      }))
      // Hide stock-in with no supplier
      

    // 2️⃣ Sales (OUT)
    const salesEntries = await Sale.find({
      "items.productId": productId,
      status: { $in: ["completed", "partially returned", "fully refunded"] },
    }).sort({ date: 1 });

    const formattedSales = salesEntries.flatMap(sale =>
      sale.items
        .filter(i => i.productId.toString() === productId.toString())
        .map(item => ({
          date: sale.date,
          type: "OUT",
          referenceNumber: sale.invoiceNumber || sale._id.toString(),
          supplierName: "—",
          cashier: sale.cashier || "—",
          quantityIn: 0,
          quantityOut: item.quantity || 0,
          costPrice: product.costPrice || 0,
          sellingPrice: item.price || 0,
          note: "Sale",
        }))
    );

    // 3️⃣ Returns (IN)
    const returnEntries = await SalesReturn.find({ "items.productId": productId }).sort({ date: 1 });
    const formattedReturns = returnEntries.flatMap(ret =>
      ret.items
        .filter(i => i.productId.toString() === productId.toString())
        .map(item => ({
          date: ret.date,
          type: "IN",
          referenceNumber: ret.invoiceNumber,
          supplierName: "—",
          cashier: ret.processedBy || "—",
          quantityIn: item.quantity,
          quantityOut: 0,
          costPrice: product.costPrice || 0,
          sellingPrice: item.price || 0,
          note: `Sales Return (Invoice ${ret.invoiceNumber})`,
        }))
    );

    // 4️⃣ Merge and sort by date
    const combined = [...formattedStockIns, ...formattedSales, ...formattedReturns].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // 5️⃣ Calculate running balance
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
