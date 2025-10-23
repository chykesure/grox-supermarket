import React, { useState } from "react";
import { UserPlus, Edit2, Trash2 } from "lucide-react";

// -----------------------------
// Inline UI Components
// -----------------------------
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg text-white font-medium shadow-sm transition ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-md border border-gray-700 bg-gray-800 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// -----------------------------
// Stock Page
// -----------------------------
const StockPage = () => {
  const [stockItems, setStockItems] = useState([
    { id: 1, name: "Product A", sku: "SKU-001", quantity: 50, location: "Warehouse 1" },
    { id: 2, name: "Product B", sku: "SKU-002", quantity: 30, location: "Warehouse 2" },
  ]);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", sku: "", quantity: "", location: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddItem = () => {
    setStockItems([...stockItems, { id: stockItems.length + 1, ...formData }]);
    setFormData({ name: "", sku: "", quantity: "", location: "" });
    setShowAddModal(false);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setShowEditModal(true);
  };

  const handleEditItem = () => {
    setStockItems(
      stockItems.map((i) => (i.id === selectedItem.id ? { ...selectedItem, ...formData } : i))
    );
    setSelectedItem(null);
    setShowEditModal(false);
  };

  const handleDelete = (id) => setStockItems(stockItems.filter((i) => i.id !== id));

  const filteredItems = stockItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Stock</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-4 h-4" /> Add Stock Item
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 max-w-md">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Stock Table */}
      <Card>
        <CardContent>
          <table className="min-w-full text-gray-300">
            <thead className="border-b border-gray-700 text-gray-400 text-xs uppercase">
              <tr>
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">SKU</th>
                <th className="py-3 text-left">Quantity</th>
                <th className="py-3 text-left">Location</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.sku}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">{item.location}</td>
                    <td className="py-3 flex justify-center gap-3">
                      <Edit2
                        className="w-4 h-4 text-blue-400 cursor-pointer"
                        onClick={() => openEditModal(item)}
                      />
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(item.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No stock items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <CardContent className="bg-gray-900 rounded-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">Add Stock Item</h3>
            <input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
            />
            <input
              placeholder="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
            />
            <input
              placeholder="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
            />
            <input
              placeholder="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddItem}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-transparent/70">
          <CardContent className="bg-gray-900 rounded-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">Edit Stock Item</h3>
            <input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
            />
            <input
              placeholder="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
            />
            <input
              placeholder="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
            />
            <input
              placeholder="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEditItem}>Update</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockPage;
