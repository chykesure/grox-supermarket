// src/models/Sale.js
import mongoose from "mongoose";

const saleSchema = mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true }, // unique invoice
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // link to customer
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        subtotal: { type: Number, required: true }, // quantity * price
      },
    ],
    total: { type: Number, required: true },
    tax: { type: Number, default: 0 }, // optional tax
    discount: { type: Number, default: 0 }, // optional discount
    paymentMode: { type: String, default: "Cash" },
    status: { type: String, default: "Completed" }, // Completed, Pending, Refunded
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
