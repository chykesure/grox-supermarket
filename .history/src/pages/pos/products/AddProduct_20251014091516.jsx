import React, { useState } from "react";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    minQty: "",
    maxQty: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product added:", product);
    // TODO: Connect this to backend API endpoint
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Add New Product</h2>
      <p className="text-gray-400 mb-6">
        Fill in the details below to add a new product.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
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
              value={product.category}
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
              value={product.price}
              onChange={handleChange}
              placeholder="Enter price"
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
              value={product.expiryDate}
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
              value={product.minQty}
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
              value={product.maxQty}
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
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
