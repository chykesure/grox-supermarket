import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true }, // must calculate in controller
});

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true }, // must generate in controller
  items: [saleItemSchema],
  total: { type: Number, required: true }, // must calculate in controller
  paymentMode: { type: String, enum: ["Cash", "Card", "Mobile Money", "Bank Transfer"], required: true },
  date: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
