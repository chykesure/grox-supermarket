import React from "react";

function EditProduct() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <p className="text-gray-400 mb-6">Update product details below.</p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Product</label>
          <select className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200">
            <option value="">Choose product to edit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            placeholder="Update product name"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            placeholder="Update price"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 t
