import React, { useState } from "react";
import { UserPlus, Edit2, Trash2 } from "lucide-react";
import { Button, Card, CardContent, Modal } from "../../../components/UIComponents";

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
        <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
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
                <tr key={s.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3">{s.name}</td>
                  <td className="py-3">{s.email}</td>
                  <td className="py-3">{s.phone}</td>
                  <td className="py-3 text-center flex justify-center gap-3">
                    <Edit2 className="w-4 h-4 text-blue-400 cursor-pointer hover:scale-110 transition-transform" onClick={() => openEditModal(s)} />
                    <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition-transform" onClick={() => handleDeleteSupplier(s.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add/Edit Modals */}
      {showAddModal && (
        <Modal title="Add Supplier" show={showAddModal} onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <input placeholder="Name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"/>
            <input placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"/>
            <input placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"/>
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddSupplier}>Save</Button>
            </div>
          </div>
        </Modal>
      )}

      {showEditModal && (
        <Modal title="Edit Supplier" show={showEditModal} onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <input placeholder="Name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"/>
            <input placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"/>
            <input placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"/>
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEditSupplier}>Update</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SuppliersPage;
