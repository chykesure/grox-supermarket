import React, { useState } from "react";

function StockInOut() {
  const [products, setProducts] = useState([
    { id: 1, name: "Milk 1L", category: "Dairy", stock: 10, price: 200 },
    { id: 2, name: "Bread", category: "Bakery", stock: 20, price: 150 },
    { id: 3, name: "Eggs (12pcs)", category: "Dairy", stock: 15, price: 500 },
  ]);

  const addStock = (id, qty) =>
    setProducts(products.map(p => p.id === id ? { ...p, stock: p.stock + qty } : p));

  const removeStock = (id, qty) =>
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock - qty) } : p));

  const removeProduct = (id) => setProducts(products.filter(p => p.id !== id));

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="overflow-auto flex-1 rounded-xl bg-gray-800 p-4 border border-gray-700 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Stock In/Out</h2>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 border-b border-gray-700">Product</th>
              <th className="px-4 py-2 border-b border-gray-700">Category</th>
              <th className="px-4 py-2 border-b border-gray-700">Stock</th>
              <th className="px-4 py-2 border-b border-gray-700">Price</th>
              <th className="px-4 py-2 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-700">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className={`px-4 py-2 font-bold ${p.stock <= 5 ? 'text-red-400' : 'text-green-400'}`}>{p.stock}</td>
                <td className="px-4 py-2">₦{p.price}</td>
                <td className="px-4 py-2 flex gap-2">
                  {/* Plus Icon */}
                  <button onClick={() => addStock(p.id, 1)} className="p-1 rounded hover:bg-gray-700">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                  {/* Minus Icon */}
                  <button onClick={() => removeStock(p.id, 1)} className="p-1 rounded hover:bg-gray-700">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"/>
                    </svg>
                  </button>
                  {/* Pencil / Edit Icon */}
                  <button className="p-1 rounded hover:bg-gray-700">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6 6L21 9l-6-6-6 6z"/>
                    </svg>
                  </button>
                  {/* Trash Icon */}
                  <button onClick={() => removeProduct(p.id)} className="p-1 rounded hover:bg-gray-700">
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
    </div>
  );
}

export default StockInOut;
