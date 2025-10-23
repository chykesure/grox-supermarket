import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

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
// Transfers Page
// -----------------------------
const TransfersPage = () => {
  const [transfers, setTransfers] = useState([
    { id: 1, item: "Product A", from: "Warehouse 1", to: "Warehouse 2", quantity: 10, status: "Pending" },
    { id: 2, item: "Product B", from: "Warehouse 2", to: "Warehouse 3", quantity: 5, status: "Completed" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [formData, setFormData] = useState({ item: "", from: "", to: "", quantity: "", status: "Pending" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddTransfer = () => {
    setTransfers([...transfers, { id: transfers.length + 1, ...formData }]);
    setFormData({ item: "", from: "", to: "", quantity: "", status: "Pending" });
    setShowAddModal(false);
  };

  const openEditModal = (transfer) => {
    setSelectedTransfer(transfer);
    setFormData(transfer);
    setShowEditModal(true);
  };

  const handleEditTransfer = () => {
    setTransfers(
      transfers.map((t) => (t.id === selectedTransfer.id ? { ...selectedTransfer, ...formData } : t))
    );
    setSelectedTransfer(null);
    setShowEditModal(false);
  };

  const handleDelete = (id) => setTransfers(transfers.filter((t) => t.id !== id));

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold text-emerald-400">Transfers</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowAddModal(true)}>
          Add Transfer
        </Button>
      </div>

      <Card>
        <CardContent>
          <table className="min-w-full text-gray-300">
            <thead className="border-b border-gray-700 text-gray-400 text-xs uppercase">
              <tr>
                <th className="py-3 text-left">Item</th>
                <th className="py-3 text-left">From</th>
                <th className="py-3 text-left">To</th>
                <th className="py-3 text-left">Quantity</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                  <td className="py-3">{t.item}</td>
                  <td className="py-3">{t.from}</td>
                  <td className="py-3">{t.to}</td>
                  <td className="py-3">{t.quantity}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.status === "Pending"
                          ? "bg-yellow-600 text-yellow-100"
                          : t.status === "Completed"
                          ? "bg-emerald-600 text-emerald-100"
                          : "bg-red-600 text-red-100"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 flex justify-center gap-3">
                    <Edit2 className="w-4 h-4 text-blue-400 cursor-pointer" onClick={() => openEditModal(t)} />
                    <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => handleDelete(t.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Transfer Modal */}
      {showAddModal && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-transparent/70">
          <CardContent className="bg-gray-900 rounded-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">Add Transfer</h3>
            <input name="item" value={formData.item} onChange={handleChange} placeholder="Item" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="from" value={formData.from} onChange={handleChange} placeholder="From Location" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="to" value={formData.to} onChange={handleChange} placeholder="To Location" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="quantity" value={formData.quantity} onChange={handleChange} type="number" placeholder="Quantity" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddTransfer}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Transfer Modal */}
      {showEditModal && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-transparent/70">
          <CardContent className="bg-gray-900 rounded-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">Edit Transfer</h3>
            <input name="item" value={formData.item} onChange={handleChange} placeholder="Item" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="from" value={formData.from} onChange={handleChange} placeholder="From Location" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="to" value={formData.to} onChange={handleChange} placeholder="To Location" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="quantity" value={formData.quantity} onChange={handleChange} type="number" placeholder="Quantity" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEditTransfer}>Update</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransfersPage;
