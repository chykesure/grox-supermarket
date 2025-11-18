import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    costPrice: "",
    sellingPrice: "",
    markup: "",
    category: "",
    minQty: "",
    maxQty: "",
    expiryDate: "",
    description: "",
    // --- New wholesale fields ---
    wholesalePrice: "",
    wholesalePack: "",
  });

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const generateSKU = (name) => {
    if (!name) return "";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${name.substring(0, 3).toUpperCase()}-${randomNum}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      const updated = { ...prev, [name]: value };

      const cost = parseFloat(name === "costPrice" ? value : prev.costPrice);
      const selling = parseFloat(name === "sellingPrice" ? value : prev.sellingPrice);

      if (cost > 0 && selling > 0) {
        const markup = ((selling - cost) / cost) * 100;
        updated.markup = markup.toFixed(2);
      } else {
        updated.markup = "";
      }

      if (name === "name" && !prev.sku) {
        updated.sku = generateSKU(value);
      }

      return updated;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.sku ||
      !product.costPrice ||
      !product.sellingPrice ||
      !product.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      Object.keys(product).forEach((key) => {
        let value = product[key];

        // Convert numeric fields to numbers
        if (
          [
            "costPrice",
            "sellingPrice",
            "markup",
            "minQty",
            "maxQty",
            "wholesalePrice",
            "wholesalePack",
          ].includes(key)
        ) {
          value = value ? Number(value) : 0;
        }

        formData.append(key, value);
      });

      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        "http://localhost:8080/api/products",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(`✅ Product "${res.data.name}" added successfully!`);

      // Reset form
      setProduct({
        name: "",
        sku: "",
        costPrice: "",
        sellingPrice: "",
        markup: "",
        category: "",
        minQty: "",
        maxQty: "",
        expiryDate: "",
        description: "",
        wholesalePrice: "",
        wholesalePack: "",
      });
      setHasExpiry(false);
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.message || "Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto bg-gray-900 p-10 rounded-lg shadow-lg text-gray-200">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-bold mb-3">Add New Product</h2>
      <p className="text-gray-400 mb-8">
        Fill in the details below to add a new product to your inventory.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* SECTION — BASIC INFO */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-300">Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">SKU / Barcode</label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                required
                placeholder="Auto-generated or enter manually"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* SECTION — PRICING */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-1 text-gray-300">Cost Price</label>
              <input
                type="number"
                name="costPrice"
                value={product.costPrice}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Selling Price</label>
              <input
                type="number"
                name="sellingPrice"
                value={product.sellingPrice}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Markup (%)</label>
              <input
                type="text"
                name="markup"
                value={product.markup}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* SECTION — WHOLESALE */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Wholesale Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-300">Wholesale Pack (Units)</label>
              <input
                type="number"
                name="wholesalePack"
                value={product.wholesalePack}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Wholesale Price</label>
              <input
                type="number"
                name="wholesalePrice"
                value={product.wholesalePrice}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* SECTION — CATEGORY + EXPIRY */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Category & Expiry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-1 text-gray-300">Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={hasExpiry}
                  onChange={(e) => {
                    setHasExpiry(e.target.checked);
                    if (!e.target.checked) {
                      setProduct((prev) => ({ ...prev, expiryDate: "" }));
                    }
                  }}
                />
                Has Expiry Date?
              </label>

              <input
                type="date"
                name="expiryDate"
                value={product.expiryDate}
                onChange={handleChange}
                disabled={!hasExpiry}
                className={`w-full px-4 py-3 rounded-lg border ${hasExpiry
                  ? "bg-gray-800 text-gray-200 border-gray-700"
                  : "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
                  }`}
              />
            </div>
          </div>
        </div>

        {/* SECTION — STOCK LEVELS */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Stock Levels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-300">Min Quantity</label>
              <input
                type="number"
                name="minQty"
                value={product.minQty}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Max Quantity</label>
              <input
                type="number"
                name="maxQty"
                value={product.maxQty}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-2 text-gray-300">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full h-28 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block mb-2 text-gray-300">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mb-3" />

          {preview && (
            <img
              src={preview}
              className="w-40 h-40 object-cover rounded-lg border border-gray-700"
            />
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 py-3 rounded-lg text-white text-lg transition 
            ${isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
