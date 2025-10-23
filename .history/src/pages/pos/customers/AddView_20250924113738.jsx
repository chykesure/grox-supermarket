import React, { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, Search } from "lucide-react";

function AddView() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "John Doe", phone: "08012345678", email: "john@example.com" },
    { id: 2, name: "Jane Smith", phone: "08098765432", email: "jane@example.com" },
  ]);

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      showToast("Name and phone are required!", "error");
      return;
    }
    setCustomers([...customers, { id: Date.now(), ...form }]);
    setForm({ name: "", phone: "", email: "" });
    showToast("Customer added successfully!");
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
    showToast("Customer deleted!", "error");
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm({ name: customer.name, phone: customer.phone, email: customer.email });
  };

  const handleUpdate = (id) => {
    setCustomers(
      customers.map((c) =>
        c.id === id ? { ...c, name: editForm.name, phone: editForm.phone, email: editForm.email } : c
      )
    );
    setEditingId(null);
    showToast("Customer updated!");
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* ✅ Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Add Customer Form */}
      <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">Add Customer</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:border-blue-500"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:border-blue-500"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:border-blue-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-medium transition"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-400">Customer List</h2>
          <div className="flex items-center bg-gray-900 rounded px-3 py-2 border border-gray-700">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent outline-none text-gray-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-gray-300 text-sm">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="border-b border-gray-700 text-gray-200">
                  <td className="px-4 py-2">
                    {editingId === c.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="px-2 py-1 rounded bg-gray-900 border border-gray-600 text-gray-200"
                      />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === c.id ? (
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="px-2 py-1 rounded bg-gray-900 border border-gray-600 text-gray-200"
                      />
                    ) : (
                      c.phone
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === c.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="px-2 py-1 rounded bg-gray-900 border border-gray-600 text-gray-200"
                      />
                    ) : (
                      c.email
                    )}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    {editingId === c.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(c.id)}
                          className="p-1 text-green-500 hover:text-green-400"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-gray-400 hover:text-gray-300"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1 text-yellow-400 hover:text-yellow-300"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1 text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddView;
