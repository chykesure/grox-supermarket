import Sale from "../models/Sale.js";
import InvoiceCounter from "../models/InvoiceCounter.js";

// Helper: get next invoice number
const getNextInvoiceNumber = async () => {
  let counter = await InvoiceCounter.findOne();
  if (!counter) {
    counter = new InvoiceCounter({ seq: 1 });
    await counter.save();
    return 1;
  }
  counter.seq += 1;
  await counter.save();
  return counter.seq;
};

// Create Sale
export const createSale = async (req, res) => {
  try {
    const { items, total, paymentMode } = req.body;

    const invoiceNumber = await getNextInvoiceNumber(); // Generate invoice number

    const sale = new Sale({
      invoiceNumber,
      items,
      total,
      paymentMode,
    });

    const savedSale = await sale.save();

    res.status(201).json(savedSale);
  } catch (err) {
    console.error("Sale creation failed:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all sales (optional)
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("items.productId");
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
