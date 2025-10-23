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

const CardContent = ({ children, className = "" }) => <div className={`p-4 ${className}`}>{children}</div>;

const Modal = ({ title, show, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-emerald-400">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// -----------------------------
// Suppliers Page
// -----------------------------
const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Supplier A", email: "a@supplier.com", phone: "08012345678" },
    { id: 2, name: "Supplier B", email: "b@supplier.com", phone: "08098765432" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSupplier = () => {
    setSuppliers([...suppliers, { id: suppliers.length + 1, ...formData }]);
    setShowAddModal(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  const openEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData(supplier);
    setShowEditModal(true);
  };

  const handleEditSupplier = () => {
    setSuppliers(
      suppliers.map((s) => (s.id === selectedSupplier.id ? { ...selectedSupplier, ...formData } : s))
    );
    setShowEditModal(false);
    setSelectedSupplier(null);
  };

  const handleDeleteSupplier = (id) => setSuppliers(suppliers.filter((s) => s.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Suppliers</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add Supplier
        </Button>
      </div>

      <Card>
        <CardContent>
          <table className="min-w-full text-gray-300">
            <thead className="border-b border-gray-700 text-gray-400 uppercase text-xs">
              <tr>
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-left">Phone</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3">{s.name}</td>
                  <td className="py-3">{s.email}</td>
                  <td className="py-3">{s.phone}</td>
                  <td className="py-3 text-center flex justify-center gap-3">
                    <Edit2
                      className="w-4 h-4 text-blue-400 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => openEditModal(s)}
                    />
                    <Trash2
                      className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => handleDeleteSupplier(s.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <Modal title="Add Supplier" show={showAddModal} onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
            />
            <input
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
            />
            <input
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddSupplier}>
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Supplier Modal */}
      {showEditModal && (
        <Modal title="Edit Supplier" show={showEditModal} onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
            />
            <input
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
            />
            <input
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEditSupplier}>
                Update
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SuppliersPage;
