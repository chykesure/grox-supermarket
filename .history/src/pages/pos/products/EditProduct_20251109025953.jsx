import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiryEnabled, setExpiryEnabled] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    sku: "",
    category: "",
    costPrice: "",
    markup: 1,
    sellingPrice: "",
    minQty: "",
    maxQty: "",
    expiryDate: "",
    description: "",
  });

  // ------------------------------------------------
  // Load all products and categories
  // ------------------------------------------------
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:8080/api/products"),
          axios.get("http://localhost:8080/api/categories"),
        ]);
        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("❌ Failed to fetch products or categories", {
          position: "top-right",
        });
      }
    };
    fetchInitialData();
  }, []);

  // ------------------------------------------------
  // Generate SKU
  // ------------------------------------------------
  const generateSKU = (name) => {
    if (!name) return "";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${name.substring(0, 3).toUpperCase()}-${randomNum}`;
  };

  // ------------------------------------------------
  // Select Product
  // ------------------------------------------------
  const handleSelect = async (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);

    if (!productId) return;

    try {
      const res = await axios.get(`http://localhost:8080/api/products/${productId}`);
      const data = res.data;

      setProductData({
        name: data.name || "",
        sku: data.sku || "",
        category: data.category?._id || data.category || "",
        costPrice: data.costPrice || "",
        markup: data.markup || 1,
        sellingPrice: data.sellingPrice || "",
        minQty: data.minQty || "",
        maxQty: data.maxQty || "",
        expiryDate: data.expiryDate ? data.expiryDate.slice(0, 10) : "",
        description: data.description || "",
      });

      // Enable expiry checkbox if product has expiryDate
      setExpiryEnabled(!!data.expiryDate);
    } catch (err) {
      console.error("Error fetching product details:", err);
      toast.error("❌ Failed to load product details", { position: "top-right" });
    }
  };

  // ------------------------------------------------
  // Handle input changes
  // ------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => {
      let updated = { ...prev, [name]: value };

      // Auto-calc selling price when cost/markup changes
      if (name === "costPrice" || name === "markup") {
        const cost = parseFloat(name === "costPrice" ? value : prev.costPrice) || 0;
        const markup = parseFloat(name === "markup" ? value : prev.markup) || 1;
        updated.sellingPrice = (cost + (cost * markup) / 100).toFixed(2);
      }

      // Generate SKU if name changes and no SKU yet
      if (name === "name" && !prev.sku) {
        updated.sku = generateSKU(value);
      }

      return updated;
    });
  };

  // ------------------------------------------------
  // Handle expiry checkbox toggle
  // ------------------------------------------------
  const handleExpiryToggle = (e) => {
    const checked = e.target.checked;
    setExpiryEnabled(checked);

    setProductData((prev) => ({
      ...prev,
      expiryDate: checked ? prev.expiryDate : "",
    }));
  };

  // ------------------------------------------------
  // Submit product update
  // ------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct)
      return toast.warn("⚠️ Please select a product to update", {
        position: "top-right",
      });

    setIsSubmitting(true);
    try {
      const dataToSend = { ...productData };
      if (!expiryEnabled) delete dataToSend.expiryDate;

      await axios.put(
        `http://localhost:8080/api/products/${selectedProduct}`,
        dataToSend,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("✅ Product updated successfully!", { position: "top-right" });

      // Refresh product list
      const productRes = await axios.get("http://localhost:8080/api/products");
      setProducts(productRes.data);

      // Reset form
      setSelectedProduct("");
      setExpiryEnabled(false);
      setProductData({
        name: "",
        sku: "",
        category: "",
        costPrice: "",
        markup: 1,
        sellingPrice: "",
        minQty: "",
        maxQty: "",
        expiryDate: "",
        description: "",
      });
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("❌ Failed to update product", { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------------
  // JSX
  // ------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-lg shadow-md relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h2 className="text-2xl font-bold mb-4 text-white">Edit Product</h2>
      <p className="text-gray-400 mb-6">Select a product and update its details below.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Select Product</label>
          <select
            value={selectedProduct}
            onChange={handleSelect}
            required
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          >
            <option value="">Choose product to edit</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name + SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">SKU / Barcode</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              required
              placeholder="Auto or manual SKU"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>
        </div>

        {/* Cost + Markup + Selling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Cost Price</label>
            <input
              type="number"
              name="costPrice"
              value={productData.costPrice}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Markup (%)</label>
            <input
              type="number"
              name="markup"
              value={productData.markup}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              value={productData.sellingPrice}
              onChange={handleChange}
              placeholder="Auto or manual"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>
        </div>

        {/* Min + Max + Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Min Quantity</label>
            <input
              type="number"
              name="minQty"
              value={productData.minQty}
              onChange={handleChange}
              required
              placeholder="Enter min qty"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Max Quantity</label>
            <input
              type="number"
              name="maxQty"
              value={productData.maxQty}
              onChange={handleChange}
              required
              placeholder="Enter max qty"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Category</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expiry Toggle + Field */}
        <div>
          <label className="inline-flex items-center gap-2 text-gray-300 mb-2">
            <input
              type="checkbox"
              checked={expiryEnabled}
              onChange={handleExpiryToggle}
              className="form-checkbox text-green-500 bg-gray-800 border-gray-600"
            />
            <span>Enable Expiry Date</span>
          </label>

          {expiryEnabled && (
            <input
              type="date"
              name="expiryDate"
              value={productData.expiryDate}
              onChange={handleChange}
              className="block w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 mt-2"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Optional details"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-6 py-2 rounded-md text-white transition flex items-center justify-center gap-2 ${isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
              }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
