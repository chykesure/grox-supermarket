// src/controllers/revenueController.js

import asyncHandler from "express-async-handler";
import Sale from "../models/Sale.js";
import SalesReturn from "../models/SalesReturn.js";
import Product from "../models/Product.js";

/* --------------------------------
   Date Helpers
--------------------------------- */
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/* --------------------------------
   GET REVENUE REPORT
--------------------------------- */
export const getRevenueReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const from = startDate
    ? startOfDay(startDate)
    : startOfDay(new Date());

  const to = endDate
    ? endOfDay(endDate)
    : endOfDay(new Date());

  /* --------------------------------
     FETCH DATA
  --------------------------------- */
  const sales = await Sale.find({
    date: { $gte: from, $lte: to },
    status: { $in: ["completed", "partially returned"] },
  }).lean();

  const returns = await SalesReturn.find({
    date: { $gte: from, $lte: to },
  }).lean();

  const products = await Product.find().lean();

  /* --------------------------------
     PRODUCT COST MAP
  --------------------------------- */
  const productCostMap = {};
  products.forEach((p) => {
    productCostMap[p._id.toString()] = {
      name: p.name,
      costPrice: p.costPrice || 0,
    };
  });

  /* --------------------------------
     LEDGER MAP
  --------------------------------- */
  const ledger = {};

  /* --------------------------------
     PROCESS SALES
  --------------------------------- */
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const productId = item.productId.toString();

      if (!ledger[productId]) {
        ledger[productId] = {
          productId,
          productName:
            item.productName ||
            productCostMap[productId]?.name ||
            "Unknown",
          soldQty: 0,
          returnedQty: 0,
          sellingPrice: item.price,
          costPrice: productCostMap[productId]?.costPrice || 0,
        };
      }

      ledger[productId].soldQty += item.quantity;
    });
  });

  /* --------------------------------
     PROCESS RETURNS
  --------------------------------- */
  returns.forEach((ret) => {
    ret.items.forEach((item) => {
      const productId = item.productId.toString();

      if (!ledger[productId]) return;

      ledger[productId].returnedQty += item.quantity;
    });
  });

  /* --------------------------------
     FINAL CALCULATIONS
  --------------------------------- */
  let grossRevenue = 0;
  let refunds = 0;
  let netRevenue = 0;
  let totalProfit = 0;

  const productBreakdown = Object.values(ledger).map((p) => {
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
      profit: Number(productProfit.toFixed(2)),
    };
  });

  /* --------------------------------
     RESPONSE
  --------------------------------- */
  res.status(200).json({
    success: true,
    period: { from, to },
    summary: {
      grossRevenue: Number(grossRevenue.toFixed(2)),
      refunds: Number(refunds.toFixed(2)),
      netRevenue: Number(netRevenue.toFixed(2)),
      profit: Number(totalProfit.toFixed(2)),
    },
    products: productBreakdown,
  });
});
