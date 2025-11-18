// src/models/
import mongoose from "mongoose";

const productLedgerSchema = mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },

    // Optional for sales
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }, // only for stock-in
    quantityAdded: { type: Number }, // only for stock-in
    balanceAfterStock: { type: Number, required: true }, // always track current balance
    costPrice: { type: Number }, // optional for sales
    sellingPrice: { type: Number }, // used for sales too

    type: { type: String, enum: ["stock-in", "sale", "opening"], required: true },
    date: { type: Date, default: Date.now },

    // Sales-specific
    quantitySold: { type: Number }, 
    paymentMode: { type: String }, 
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // saleId or purchaseId
  },
  { timestamps: true }
);

export default mongoose.model("ProductLedger", productLedgerSchema);
