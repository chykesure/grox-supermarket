import React from "react";

function Categories() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Categories</h2>
      <p className="text-gray-400 mb-6">
        Add, edit, or remove product categories.
      </p>

      <div className="mb-6">
        <form className="flex gap-2">
          <input
            type="text"
            placeholder="New category"
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 flex-1"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Add
          </button>
        </form>
      </div>

      <table className="w-full border border-gray-700 rounded-md text-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Category Name</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-700">
            <td className="px-4 py-2">Example Category</td>
            <td className="px-4 py-2 flex gap-2">
              <button className="px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-500">
                Edit
              </button>
              <button className="px-2 py-1 bg-red-600 rounded hover:bg-red-500">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
