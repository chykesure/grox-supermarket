import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

// Helper functions (unchanged)
const startOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
const endOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return startOfDay(new Date(d.setDate(diff)));
};

const endOfWeek = (date) => {
  const start = startOfWeek(new Date(date));
  return endOfDay(new Date(start.setDate(start.getDate() + 6)));
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Base status filter: include sales that generated revenue
    const statusFilter = {
      status: { $in: ["completed", "partially returned"] },
    };

    let sales = [];
    let periods = [];

    if (startDate && endDate) {
      // CUSTOM DATE RANGE: Filter sales directly in DB
      const rangeStart = startOfDay(new Date(startDate));
      const rangeEnd = endOfDay(new Date(endDate));

      sales = await Sale.find({
        ...statusFilter,
        date: { $gte: rangeStart, $lte: rangeEnd },
      });

      periods = [{
        period: `${startDate} → ${endDate}`,
        start: rangeStart,
        end: rangeEnd,
      }];
    } else {
      // DEFAULT PERIODS: Today, This Week, This Month
      const now = new Date();

      const todayStart = startOfDay(now);
      const todayEnd = endOfDay(now);
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      // Fetch ALL relevant sales once (efficient)
      sales = await Sale.find({
        ...statusFilter,
        date: { $gte: monthStart }, // earliest period is this month
      });

      periods = [
        { period: "Today", start: todayStart, end: todayEnd },
        { period: "This Week", start: weekStart, end: weekEnd },
        { period: "This Month", start: monthStart, end: monthEnd },
      ];
    }

    // Pre-load products (cached for all calculations)
    const products = await Product.find();
    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p.costPrice;
    });

    const revenueData = periods.map(({ period, start, end }) => {
      let salesTotal = 0;
      let costTotal = 0;

      sales.forEach((invoice) => {
        const invoiceDate = new Date(invoice.date);
        if (invoiceDate >= start && invoiceDate <= end) {
          invoice.items.forEach((item) => {
            const costPrice = productMap[item.productId.toString()] || 0;
            salesTotal += item.price * item.quantity;
            costTotal += costPrice * item.quantity;
          });
        }
      });

      const profit = salesTotal - costTotal;

      return {
        period,
        sales: Number(salesTotal.toFixed(2)),
        cost: Number(costTotal.toFixed(2)),
        profit: Number(profit.toFixed(2)),
      };
    });

    res.json(revenueData);
  } catch (error) {
    console.error("Revenue Report Error:", error);
    res.status(500).json({ message: "Failed to generate revenue report" });
  }
};