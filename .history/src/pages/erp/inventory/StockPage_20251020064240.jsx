import React, { useState } from "react";
import { Card, CardContent, Button, Modal } from "../../../components/UIComponents";
import { Edit2, Trash2 } from "lucide-react";

const StockPage = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Product A", sku: "SKU001", quantity: 50, location: "Warehouse 1" },
    { id: 2, name: "Product B", sku: "SKU002", quantity: 20, location: "Warehouse 2" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", sku: "", quantity: "", location: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, ...formData }]);
    setFormData({ name: "", sku: "", quantity: "", location: "" });
    setShowAddModal(false);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setShowEditModal(true);
  };

  const handleEditItem = () => {
    setItems(items.map((i) => (i.id === selectedItem.id ? { ...selectedItem, ...formData } : i)));
    setSelectedItem(null);
    setShowEditModal(false);
  };

  const handleDelete = (id) => setItems(items.filter((i) => i.id !== id));

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold text-emerald-400">Stock</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowAddModal(true)}>Add Stock Item</Button>
      </div>

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
              {items.map((i) => (
                <tr key={i.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                  <td className="py-3">{i.name}</td>
                  <td className="py-3">{i.sku}</td>
                  <td className="py-3">{i.quantity}</td>
                  <td className="py-3">{i.location}</td>
                  <td className="py-3 flex justify-center gap-3">
                    <Edit2 className="w-4 h-4 text-blue-400 cursor-pointer" onClick={() => openEditModal(i)} />
                    <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => handleDelete(i.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add Stock Item" show={showAddModal} onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddItem}>Save</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit Stock Item" show={showEditModal} onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"/>
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEditItem}>Update</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StockPage;
