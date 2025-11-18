import mongoose from "mongoose";

const invoiceCounterSchema = new mongoose.Schema({
  seq: { type: Number, default: 0 },
});

const InvoiceCounter = mongoose.model("InvoiceCounter", invoiceCounterSchema);
export default InvoiceCounter;
