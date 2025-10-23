import React from "react";

function AddProduct() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <p className="text-gray-400 mb-6">
        Fill in the details below to add a new product.
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            placeholder="Enter price"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200">
            <option value="">Select category</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
