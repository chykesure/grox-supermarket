import Sale from "../models/Sale.js";
import SalesReturn from "../models/SalesReturn.js";
import Product from "../models/Product.js";

// ---------- Date helpers ----------
const startOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
const endOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));

// ---------- Controller ----------
export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const from = startDate
      ? startOfDay(new Date(startDate))
      : startOfDay(new Date());

    const to = endDate
      ? endOfDay(new Date(endDate))
      : endOfDay(new Date());

    // ---------- Fetch data ----------
    const sales = await Sale.find({
      date: { $gte: from, $lte: to },
      status: { $in: ["completed", "partially returned"] }
    });

    const returns = await SalesReturn.find({
      date: { $gte: from, $lte: to },
      status: "approved"
    });

    const products = await Product.find();

    // ---------- Product cost map ----------
    const productCostMap = {};
    products.forEach(p => {
      productCostMap[p._id.toString()] = {
        name: p.name,
        costPrice: p.costPrice || 0
      };
    });

    // ---------- Ledger ----------
    const ledger = {};

    // ---------- Process Sales ----------
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const productId = item.productId.toString();

        if (!ledger[productId]) {
          ledger[productId] = {
            productId,
            productName: item.productName || productCostMap[productId]?.name || "Unknown",
            soldQty: 0,
            returnedQty: 0,
            sellingPrice: item.price,
            costPrice: productCostMap[productId]?.costPrice || 0
          };
        }

        ledger[productId].soldQty += item.quantity;
      });
    });

    // ---------- Process Returns ----------
    returns.forEach(ret => {
      ret.items.forEach(item => {
        const productId = item.productId.toString();

        if (!ledger[productId]) return;

        ledger[productId].returnedQty += item.quantity;
      });
    });

    // ---------- Final calculations ----------
    let grossRevenue = 0;
    let refunds = 0;
    let netRevenue = 0;
    let totalProfit = 0;

    const productsReport = Object.values(ledger).map(p => {
      const netQty = p.soldQty - p.returnedQty;

      const productGross = p.soldQty * p.sellingPrice;
      const productRefund = p.returnedQty * p.sellingPrice;
      const productNet = productGross - productRefund;
      const productCost = netQty * p.costPrice;
      const productProfit = productNet - productCost;

      grossRevenue += productGross;
      refunds += productRefund;
      netRevenue += productNet;
      totalProfit += productProfit;

      return {
        productId: p.productId,
        productName: p.productName,
        soldQty: p.soldQty,
        returnedQty: p.returnedQty,
        netQty,
        grossRevenue: Number(productGross.toFixed(2)),
        refunds: Number(productRefund.toFixed(2)),
        netRevenue: Number(productNet.toFixed(2)),
        profit: Number(productProfit.toFixed(2))
      };
    });

    // ---------- Response ----------
    res.json({
      period: { from, to },
      summary: {
        grossRevenue: Number(grossRevenue.toFixed(2)),
        refunds: Number(refunds.toFixed(2)),
        netRevenue: Number(netRevenue.toFixed(2)),
        profit: Number(totalProfit.toFixed(2))
      },
      products: productsReport
    });

  } catch (error) {
    console.error("Revenue Report Error:", error);
    res.status(500).json({ message: "Failed to generate revenue report" });
  }
};
