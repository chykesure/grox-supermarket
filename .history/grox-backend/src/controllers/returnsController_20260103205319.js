// src/controllers/revenueController.js
import Sale from "../models/Sale.js";
import Return from "../models/SalesReturn.js";
import Product from "../models/Product.js";

// -----------------------------
// Date helpers
// -----------------------------
const startOfDay = (d) => new Date(new Date(d).setHours(0, 0, 0, 0));
const endOfDay = (d) => new Date(new Date(d).setHours(23, 59, 59, 999));

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return startOfDay(d);
};

const endOfWeek = (date) => {
  const start = startOfWeek(date);
  return endOfDay(new Date(start.setDate(start.getDate() + 6)));
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

// -----------------------------
// Revenue Report (Option B)
// -----------------------------
export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let periods = [];

    if (startDate && endDate) {
      periods = [{
        label: `${startDate} → ${endDate}`,
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      }];
    } else {
      const now = new Date();
      periods = [
        { label: "Today", start: startOfDay(now), end: endOfDay(now) },
        { label: "This Week", start: startOfWeek(now), end: endOfWeek(now) },
        { label: "This Month", start: startOfMonth(now), end: endOfMonth(now) },
      ];
    }

    // Fetch all sales for the widest possible range
    const earliest = periods.reduce(
      (min, p) => (p.start < min ? p.start : min),
      periods[0].start
    );

    const sales = await Sale.find({
      status: { $in: ["completed", "partially returned", "fully refunded"] },
      date: { $gte: earliest },
    }).lean();

    // Fetch returns for those sales
    const saleIds = sales.map(s => s._id);
    const returns = await Return.find({ saleId: { $in: saleIds } }).lean();

    // Map returns → saleId + productId
    const returnMap = {};
    returns.forEach(ret => {
      ret.items.forEach(item => {
        const key = `${ret.saleId}_${item.productId}`;
        returnMap[key] = (returnMap[key] || 0) + item.quantity;
      });
    });

    // Product cost lookup
    const products = await Product.find().lean();
    const costMap = {};
    products.forEach(p => {
      costMap[p._id.toString()] = p.costPrice || 0;
    });

    const report = periods.map(({ label, start, end }) => {
      let salesTotal = 0;
      let costTotal = 0;

      sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate < start || saleDate > end) return;

        sale.items.forEach(item => {
          const soldQty = item.quantity;
          const returnedQty =
            returnMap[`${sale._id}_${item.productId}`] || 0;

          const netQty = soldQty - returnedQty;
          if (netQty <= 0) return;

          const costPrice = costMap[item.productId.toString()] || 0;

          salesTotal += netQty * item.price;
          costTotal += netQty * costPrice;
        });
      });

      return {
        period: label,
        sales: Number(salesTotal.toFixed(2)),
        cost: Number(costTotal.toFixed(2)),
        profit: Number((salesTotal - costTotal).toFixed(2)),
      };
    });

    res.json(report);
  } catch (err) {
    console.error("Revenue Report Error:", err);
    res.status(500).json({ message: "Failed to generate revenue report" });
  }
};
