import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

// Helper functions
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

// GET /api/revenue/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
export const getRevenueReport = async (req, res) => {
  try {
    const sales = await Sale.find({ status: "completed" });
    const products = await Product.find();

    const { startDate, endDate } = req.query;

    let periods = [];

    if (startDate && endDate) {
      periods = [
        {
          period: `${startDate} → ${endDate}`,
          start: startOfDay(new Date(startDate)),
          end: endOfDay(new Date(endDate)),
        },
      ];
    } else {
      const now = new Date();
      periods = [
        { period: "Today", start: startOfDay(now), end: endOfDay(now) },
        { period: "This Week", start: startOfWeek(now), end: endOfWeek(now) },
        { period: "This Month", start: startOfMonth(now), end: endOfMonth(now) },
      ];
    }

    const revenueData = periods.map(({ period, start, end }) => {
      let salesTotal = 0;
      let costTotal = 0;

      sales.forEach((invoice) => {
        const invoiceDate = new Date(invoice.date);
        if (invoiceDate >= start && invoiceDate <= end) {
          invoice.items.forEach((item) => {
            const product = products.find(
              (p) => p._id.toString() === item.productId.toString()
            );
            if (!product) return;

            salesTotal += item.price * item.quantity;
            costTotal += product.costPrice * item.quantity;
          });
        }
      });

      return {
        period,
        sales: salesTotal,
        cost: costTotal,
        profit: salesTotal - costTotal,
      };
    });

    res.json(revenueData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate revenue report" });
  }
};
