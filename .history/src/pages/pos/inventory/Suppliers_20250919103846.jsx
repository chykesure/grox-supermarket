import React, { useState } from "react";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Dairy Co.", contact: "John Doe", email: "john@dairyco.com", phone: "08012345678", address: "Lagos" },
    { id: 2, name: "Bakery Supplies", contact: "Jane Smith", email: "jane@bakerysup.com", phone: "08087654321", address: "Abuja" },
    { id: 3, name: "Egg Farmers Ltd.", contact: "Mike Brown", email: "mike@eggfarmers.com", phone: "08098765432", address: "Port Harcourt" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", contact: "", email: "", phone: "", address: "" });

  const addSupplier = () => {
    if (!newSupplier.name) return;
    setSuppliers([...suppliers, { id: Date.now(), ...newSupplier }]);
    setNewSupplier({ name: "", contact: "", email: "", phone: "", address: "" });
    setShowModal(false);
  };

  const removeSupplier = (id) => setSuppliers(suppliers.filter(s => s.id !== id));

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-green-400">Suppliers</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Add Supplier
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl bg-gray-800 p-4 border border-gray-700 shadow-lg">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 border-b border-gray-700 text-left w-2/6">Supplier Name</th>
              <th className="px-4 py-2 border-b border-gray-700 text-left w-1/6">Contact</th>
              <th className="px-4 py-2 border-b border-gray-700 text-left w-1/6">Email</th>
              <th className="px-4 py-2 border-b border-gray-700 text-left w-1/6">Phone</th>
              <th className="px-4 py-2 border-b border-gray-700 text-left w-1/6">Address</th>
              <th className="px-4 py-2 border-b border-gray-700 text-center w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {suppliers.map(s => (
              <tr key={s.id} className="hover:bg-gray-700">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.contact}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.phone}</td>
                <td className="px-4 py-2">{s.address}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  {/* Edit Icon */}
                  <button className="p-1 rounded hover:bg-gray-700">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6 6L21 9l-6-6-6 6z"/>
                    </svg>
                  </button>
                  {/* Delete Icon */}
                  <button onClick={() => removeSupplier(s.id)} className="p-1 rounded hover:bg-gray-700">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7L5 7m5 0v12m4-12v12M6 7l1-3h10l1 3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-trans bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Add New Supplier</h3>
            <div className="flex flex-col gap-3">
              <input
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Supplier Name"
                value={newSupplier.name}
                onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Contact Person"
                value={newSupplier.contact}
                onChange={e => setNewSupplier({ ...newSupplier, contact: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Email"
                value={newSupplier.email}
                onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Phone"
                value={newSupplier.phone}
                onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Address"
                value={newSupplier.address}
                onChange={e => setNewSupplier({ ...newSupplier, address: e.target.value })}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={addSupplier}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Suppliers;
