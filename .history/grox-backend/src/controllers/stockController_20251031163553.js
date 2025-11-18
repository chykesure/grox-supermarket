import Stock from "../models/Stock.js";
import Ledger from "../models/Ledger.js";
import Supplier from "../models/Supplier.js";

// --------------------
// Helper Function
// --------------------
const generateReferenceNumber = (prefix = "REF") => {
  const random = Math.floor(100000 + Math.random() * 900000);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${prefix}-${date}-${random}`;
};

// --------------------
// Save Stock Invoice (Add or Restock)
// --------------------
export const saveStockInvoice = async (req, res) => {
  try {
    const { supplierId, items, totalAmount, referenceNumber } = req.body;

    if (!supplierId || !items || items.length === 0 || !referenceNumber) {
      return res
        .status(400)
        .json({ message: "Supplier, items, and reference number are required." });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found." });

    const savedStocks = [];
    const ledgerEntries = [];

    for (const item of items) {
      if (!item.productId) continue;

      let stock = await Stock.findOne({ sku: item.sku });
      if (stock) {
        stock.quantity += item.quantity;
        stock.stockBalance += item.quantity;
        stock.costPrice = item.costPrice || stock.costPrice;
        stock.sellingPrice = item.sellingPrice || stock.sellingPrice;
        stock.referenceNumber = referenceNumber; // ✅ assign user ref
        stock.date = new Date();
        await stock.save();
      } else {
        stock = await new Stock({
          supplierId,
          productId: item.productId,
          productName: item.name,
          sku: item.sku,
          quantity: item.quantity,
          stockBalance: item.quantity,
          costPrice: item.costPrice,
          sellingPrice: item.sellingPrice,
          referenceNumber, // ✅ assign user ref
          date: new Date(),
        }).save();
      }

      savedStocks.push(stock);

      ledgerEntries.push({
        productId: stock._id,
        productName: stock.productName,
        supplierId,
        quantityAdded: item.quantity,
        balanceAfterStock: stock.stockBalance,
        costPrice: stock.costPrice,
        sellingPrice: stock.sellingPrice,
        referenceNumber, // ✅ added
        type: "stock-in",
        date: new Date(),
      });
    }

    if (ledgerEntries.length > 0) {
      await Ledger.insertMany(ledgerEntries);
    }

    res.status(201).json({
      message: "Stock invoice saved and ledger updated.",
      referenceNumber, // ✅ send back
      data: savedStocks,
    });
  } catch (err) {
    console.error("Error saving stock invoice:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// --------------------
// Confirm Stock Invoice
// --------------------
export const confirmStockInvoice = async (req, res) => {
  try {
    const { supplierId, items, referenceNumber } = req.body;
    const ref = referenceNumber || generateReferenceNumber("CNF");

    if (!supplierId || !items || items.length === 0) {
      return res.status(400).json({ message: "Supplier and items are required." });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found." });

    const savedStocks = [];
    const ledgerEntries = [];

    for (const item of items) {
      if (!item.sku) continue;

      let stock = await Stock.findOne({ sku: item.sku });

      if (stock) {
        stock.quantity += item.quantity;
        stock.stockBalance += item.quantity;
        stock.costPrice = item.costPrice || stock.costPrice;
        stock.sellingPrice = item.sellingPrice || stock.sellingPrice;
        stock.referenceNumber = ref;
        stock.date = new Date();
        await stock.save();
      } else {
        stock = await new Stock({
          supplierId,
          productId: item.productId,
          productName: item.name,
          sku: item.sku,
          quantity: item.quantity,
          stockBalance: item.quantity,
          costPrice: item.costPrice,
          sellingPrice: item.sellingPrice,
          referenceNumber: ref,
          date: new Date(),
        }).save();
      }

      savedStocks.push(stock);

      ledgerEntries.push({
        productId: stock._id,
        productName: stock.productName,
        supplierId,
        quantityAdded: item.quantity,
        balanceAfterStock: stock.stockBalance,
        costPrice: stock.costPrice,
        sellingPrice: stock.sellingPrice,
        type: "stock-in",
        date: new Date(),
        referenceNumber: ref,
      });
    }

    if (ledgerEntries.length > 0) {
      await Ledger.insertMany(ledgerEntries);
    }

    res.status(201).json({
      message: "Stock confirmed and ledger updated.",
      referenceNumber: ref,
      data: savedStocks,
    });
  } catch (err) {
    console.error("Error confirming stock invoice:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --------------------
// Create or Restock Single Stock Item
// --------------------
export const createStockItem = async (req, res) => {
  try {
    const { name, sku, quantity, costPrice, sellingPrice, location } = req.body;
    const ref = generateReferenceNumber("STK");

    if (!name || !sku || quantity === undefined || costPrice === undefined) {
      return res.status(400).json({ success: false, message: "Name, SKU, quantity, and cost price are required." });
    }

    const existing = await Stock.findOne({ sku });
    if (existing) {
      existing.quantity += quantity;
      existing.stockBalance += quantity;
      existing.costPrice = costPrice;
      existing.sellingPrice = sellingPrice || existing.sellingPrice;
      existing.referenceNumber = ref;
      existing.date = new Date();
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Stock updated successfully!",
        referenceNumber: ref,
        data: existing,
      });
    }

    const newStock = new Stock({
      productName: name,
      sku,
      quantity,
      stockBalance: quantity,
      costPrice,
      sellingPrice: sellingPrice || 0,
      location: location || "Main",
      referenceNumber: ref,
      date: new Date(),
    });

    await newStock.save();
    res.status(201).json({
      success: true,
      message: "Stock created successfully!",
      referenceNumber: ref,
      data: newStock,
    });
  } catch (err) {
    console.error("Error creating stock:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
// --------------------
// Get All Stock Items (with supplier info) - Fixed
// --------------------
export const getStockItems = async (req, res) => {
  try {
    const ledgers = await Ledger.find()
      .populate("supplierId", "name") // only for supplier name
      .populate("productId", "name sku")
      .sort({ createdAt: -1 });

    const formatted = ledgers.map(l => ({
      _id: l._id,
      productName: l.productName || l.productId?.name || "—",
      supplierName: l.supplierId?.name || "—",
      supplierId: l.supplierId?._id?.toString() || l.supplierId?.toString() || "", // ✅ always string
      quantityAdded: l.quantityAdded || 0,
      balanceAfterStock: l.balanceAfterStock || 0,
      costPrice: l.costPrice || 0,
      sellingPrice: l.sellingPrice || 0,
      type: l.type || "—",
      referenceNumber: l.referenceNumber || "—",
      date: l.date || l.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching ledger records:", err);
    res.status(500).json({ message: "Error fetching ledger records", error: err.message });
  }
};

// --------------------
// Get Stock by SKU
// --------------------
export const getStockBySKU = async (req, res) => {
  try {
    const { sku } = req.params;
    const item = await Stock.findOne({ sku });
    if (!item) return res.status(404).json({ message: "Stock not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Update Stock Item
// --------------------
export const updateStockItem = async (req, res) => {
  try {
    const { sku } = req.params;
    const updates = req.body;
    const ref = generateReferenceNumber("UPD");

    const stock = await Stock.findOne({ sku });
    if (!stock) return res.status(404).json({ message: "Stock item not found" });

    Object.assign(stock, updates);
    if (updates.quantity !== undefined) {
      stock.stockBalance = updates.quantity;
    }
    stock.referenceNumber = ref;
    stock.date = new Date();

    await stock.save();

    await Ledger.create({
      productId: stock._id,
      productName: stock.productName,
      supplierId: stock.supplierId,
      quantityAdded: updates.quantity || 0,
      balanceAfterStock: stock.stockBalance,
      costPrice: stock.costPrice,
      sellingPrice: stock.sellingPrice,
      type: "stock-update",
      referenceNumber: ref,
      date: new Date(),
    });

    res.json({ message: "Stock updated", referenceNumber: ref, stock });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Delete Stock Item
// --------------------
export const deleteStockItem = async (req, res) => {
  try {
    const { sku } = req.params;
    const deleted = await Stock.findOneAndDelete({ sku });
    if (!deleted) return res.status(404).json({ message: "Stock item not found" });

    await Ledger.create({
      productId: deleted._id,
      productName: deleted.productName,
      supplierId: deleted.supplierId,
      quantityAdded: 0,
      balanceAfterStock: 0,
      costPrice: deleted.costPrice,
      sellingPrice: deleted.sellingPrice,
      type: "stock-deleted",
      referenceNumber: deleted.referenceNumber,
      date: new Date(),
    });

    res.json({ message: "Stock deleted successfully", referenceNumber: deleted.referenceNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// --------------------
// Get Supplier Summary by Supplier + Reference Number
// --------------------
export const getSupplierSummary = async (req, res) => {
  try {
    const summary = await Ledger.aggregate([
      {
        $match: { type: "stock-in" },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplierId",
          foreignField: "_id",
          as: "supplierInfo",
        },
      },
      {
        $unwind: {
          path: "$supplierInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            supplierId: "$supplierId",
            referenceNumber: "$referenceNumber",
          },
          supplierName: { $first: "$supplierInfo.name" },
          referenceNumber: { $first: "$referenceNumber" },
          totalProducts: { $addToSet: "$productId" },
          totalQuantityAdded: { $sum: "$quantityAdded" },
          totalCostValue: { $sum: { $multiply: ["$quantityAdded", "$costPrice"] } },
          totalSellingValue: { $sum: { $multiply: ["$quantityAdded", "$sellingPrice"] } },
          lastTransactionDate: { $max: "$date" },
        },
      },
      {
        $project: {
          _id: 0,
          supplierId: "$_id.supplierId",
          referenceNumber: 1,
          supplierName: 1,
          productCount: { $size: "$totalProducts" },
          totalQuantityAdded: 1,
          totalCostValue: 1,
          totalSellingValue: 1,
          lastTransactionDate: 1,
        },
      },
      { $sort: { lastTransactionDate: -1 } },
    ]);

    res.json(summary);
  } catch (err) {
    console.error("Error fetching supplier summary:", err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Get Current Stock Balances
// --------------------
export const getStockBalance = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ productName: 1 }); // optional: sort by name

    const formatted = stocks.map((s) => ({
      _id: s._id,
      productName: s.productName,
      sku: s.sku,
      location: s.location || "Main",
      quantityInStock: s.stockBalance || 0,
      costPrice: s.costPrice || 0,
      sellingPrice: s.sellingPrice || 0,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching stock balances:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProductsWithStock = async (req, res) => {
  const stocks = await Stock.find().populate("product");
  res.json(stocks.map(s => ({
    _id: s.product._id,
    name: s.product.name,
    stock: s.quantity,
    sellingPrice: s.product.sellingPrice,
    sku: s.product.sku
  })));
};

