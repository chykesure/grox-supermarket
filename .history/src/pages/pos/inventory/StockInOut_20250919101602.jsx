import React, { useState } from "react";
import { PlusIcon, MinusIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";

function StockInOut() {
  const [products, setProducts] = useState([
    { id: 1, name: "Milk 1L", category: "Dairy", stock: 10 },
    { id: 2, name: "Bread", category: "Bakery", stock: 20 },
    { id: 3, name: "Eggs (12pcs)", category: "Dairy", stock: 15 },
  ]);

  const addStock = (id, qty) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: p.stock + qty } : p));
  };

  const removeStock = (id, qty) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock - qty) } : p));
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="overflow-y-auto flex-1 rounded-xl bg-gray-800 p-4 border border-gray-700 shadow-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 border-b border-gray-700">Product</th>
              <th className="px-4 py-2 border-b border-gray-700">Category</th>
              <th className="px-4 py-2 border-b border-gray-700">Stock</th>
              <th className="px-4 py-2 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-700">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className={`px-4 py-2 font-semibold ${p.stock <= 5 ? 'text-red-400' : 'text-green-400'}`}>{p.stock}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => addStock(p.id, 1)} className="p-1 rounded hover:bg-gray-700">
                    <PlusIcon className="w-5 h-5 text-green-400" />
                  </button>
                  <button onClick={() => removeStock(p.id, 1)} className="p-1 rounded hover:bg-gray-700">
                    <MinusIcon className="w-5 h-5 text-red-400" />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-700">
                    <PencilIcon className="w-5 h-5 text-blue-400" />
                  </button>
                  <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-1 rounded hover:bg-gray-700">
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

export default StockInOut;
