// src/models/Sale.js
import mongoose from "mongoose";

const saleSchema = mongoose.Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    paymentMode: { type: String, default: "Cash" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Use default export
export default mongoose.model("Sale", saleSchema);
