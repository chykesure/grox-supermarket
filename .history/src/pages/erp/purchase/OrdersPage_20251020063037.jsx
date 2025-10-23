import React, { useState } from "react";
import { UserPlus, Edit2, Trash2, X } from "lucide-react";
import { Button, Card, CardContent, Modal } from "../../../components/UIComponents";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    { id: 1, reference: "ORD-001", supplier: "Supplier A", date: "2025-10-01", status: "Pending" },
    { id: 2, reference: "ORD-002", supplier: "Supplier B", date: "2025-10-05", status: "Completed" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    reference: "",
    supplier: "",
    date: "",
    status: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddOrder = () => {
    const newOrder = { id: orders.length + 1, ...formData };
    setOrders([...orders, newOrder]);
    setShowAddModal(false);
    setFormData({ reference: "", supplier: "", date: "", status: "" });
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setFormData(order);
    setShowEditModal(true);
  };

  const handleEditOrder = () => {
    setOrders(
      orders.map((o) => (o.id === selectedOrder.id ? { ...selectedOrder, ...formData } : o))
    );
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (id) => setOrders(orders.filter((o) => o.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Purchase Orders</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add Order
        </Button>
      </div>

      <Card>
        <CardContent>
          <table className="min-w-full text-gray-300">
            <thead className="border-b border-gray-700 text-gray-400 uppercase text-xs">
              <tr>
                <th className="py-3 text-left">Reference</th>
                <th className="py-3 text-left">Supplier</th>
                <th className="py-3 text-left">Date</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3">{order.reference}</td>
                  <td className="py-3">{order.supplier}</td>
                  <td className="py-3">{order.date}</td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3 text-center flex justify-center gap-3">
                    <Edit2
                      className="w-4 h-4 text-blue-400 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => openEditModal(order)}
                    />
                    <Trash2
                      className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => handleDeleteOrder(order.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add Purchase Order" show={showAddModal} onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <input
              placeholder="Reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              placeholder="Supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddOrder}>
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit Purchase Order" show={showEditModal} onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <input
              placeholder="Reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEditOrder}>
                Update
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrdersPage;
