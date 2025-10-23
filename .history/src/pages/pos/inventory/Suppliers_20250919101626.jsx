import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

function Suppliers() {
  const suppliers = [
    { id: 1, name: "Dairy Co.", phone: "08012345678" },
    { id: 2, name: "Bakery Supplies", phone: "08087654321" },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="overflow-y-auto flex-1 rounded-xl bg-gray-800 p-4 border border-gray-700 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-green-400">Suppliers</h2>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 border-b border-gray-700">Supplier</th>
              <th className="px-4 py-2 border-b border-gray-700">Phone</th>
              <th className="px-4 py-2 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-700">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.phone}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="p-1 rounded hover:bg-gray-700">
                    <PencilIcon className="w-5 h-5 text-blue-400" />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-700">
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Suppliers;
