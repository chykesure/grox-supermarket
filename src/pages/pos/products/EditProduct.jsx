import React, { useState } from "react";

function EditProduct() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    minQty: "",
    maxQty: "",
    expiryDate: "",
  });

  const handleSelect = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);

    // TODO: Fetch product details by ID and prefill form
    // Example:
    // fetch(`/api/products/${productId}`).then(res => res.json()).then(data => setProductData(data));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated product:", productData);
    // TODO: Send PUT request to update product
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Edit Product</h2>
      <p className="text-gray-400 mb-6">Update product details below.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Product */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Select Product
          </label>
          <select
            value={selectedProduct}
            onChange={handleSelect}
            required
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          >
            <option value="">Choose product to edit</option>
            {/* Example products; replace with dynamic options */}
            <option value="1">Coca-Cola</option>
            <option value="2">Bread</option>
            <option value="3">Soap</option>
          </select>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Update product name"
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Category
            </label>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Drinks">Drinks</option>
              <option value="Household">Household</option>
              <option value="Cosmetics">Cosmetics</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              placeholder="Update price"
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={productData.expiryDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Minimum Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Minimum Quantity
            </label>
            <input
              type="number"
              name="minQty"
              value={productData.minQty}
              onChange={handleChange}
              placeholder="Enter minimum quantity"
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>

          {/* Maximum Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Maximum Quantity
            </label>
            <input
              type="number"
              name="maxQty"
              value={productData.maxQty}
              onChange={handleChange}
              placeholder="Enter maximum quantity"
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
