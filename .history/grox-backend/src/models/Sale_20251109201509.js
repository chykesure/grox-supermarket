// src/models/Sale.js
import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: true }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    items: [saleItemSchema],
    total: { type: Number, required: true },
    paymentMode: { type: String, enum: ["Cash", "Mobile Money", "Bank Transfer", "POS", "Credit", "Card"], required: true },
    date: { type: Date, default: Date.now },

    // Optional for audit trail
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },

    // Status for future enhancements (optional)
    status: { type: String, enum: ["completed", "refunded", "pending"], default: "completed" },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
