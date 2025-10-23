import React, { useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Beverages" },
    { id: 2, name: "Snacks" },
    { id: 3, name: "Cleaning Supplies" },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategories([...categories, { id: Date.now(), name: newCategory }]);
    setNewCategory("");
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditName(name);
  };

  const handleSaveEdit = () => {
    setCategories(
      categories.map((cat) =>
        cat.id === editId ? { ...cat, name: editName } : cat
      )
    );
    setEditId(null);
    setEditName("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Product Categories</h2>
      <p className="text-gray-400 mb-6">
        Add, edit, or remove product categories.
      </p>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
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

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search category..."
          className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
        />
      </div>

      {/* Category Table */}
      <table className="w-full border border-gray-700 rounded-md text-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Category Name</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <tr key={cat.id} className="border-t border-gray-700">
                <td className="px-4 py-2">
                  {editId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-2 py-1 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  {editId === cat.id ? (
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-500"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(cat.id, cat.name)}
                      className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="2"
                className="text-center py-4 text-gray-500 italic"
              >
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
