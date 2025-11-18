import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    minQty: { type: Number },
    maxQty: { type: Number },
    expiryDate: { type: Date },
    description: { type: String },
    costPrice: { type: Number, required: true },
    markup: { type: Number, default: 1 }, // ✅ Markup % field
    sellingPrice: { type: Number, required: true },
    image: { type: String }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
