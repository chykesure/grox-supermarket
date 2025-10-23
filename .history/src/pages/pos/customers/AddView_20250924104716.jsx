import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

function AddView() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "John Doe", phone: "08012345678", email: "john@example.com" },
    { id: 2, name: "Jane Smith", phone: "08098765432", email: "jane@example.com" },
  ]);

  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setCustomers([...customers, { id: Date.now(), ...form }]);
    setForm({ name: "", phone: "", email: "" });
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
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
        <h2 className="text-xl font-semibold text-blue-400 mb-4">Customer List</h2>
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
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-700 text-gray-200">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button className="p-1 text-yellow-400 hover:text-yellow-300">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No customers added yet.
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
