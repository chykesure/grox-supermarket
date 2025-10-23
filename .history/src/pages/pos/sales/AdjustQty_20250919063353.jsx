// src/pages/pos/sales/AdjustQty.jsx
import React, { useState, useEffect } from "react";

function AdjustQty() {
  // Dummy cart items / inventory
  const [items, setItems] = useState([
    { id: 1, name: "Milk 1L", quantity: 2, price: 200 },
    { id: 2, name: "Bread", quantity: 1, price: 150 },
    { id: 3, name: "Eggs (12pcs)", quantity: 3, price: 500 },
  ]);

  const updateQuantity = (id, qty) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Adjust Item Quantities
      </h1>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Items Table */}
        <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg p-4 shadow-lg">
          <table className="w-full table-auto border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-2 py-1 border-b border-gray-600">Item</th>
                <th className="px-2 py-1 border-b border-gray-600">Qty</th>
                <th className="px-2 py-1 border-b border-gray-600">Price</th>
                <th className="px-2 py-1 border-b border-gray-600">Total</th>
                <th className="px-2 py-1 border-b border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="px-2 py-1">{item.name}</td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-16 p-1 rounded bg-gray-900 border border-gray-600 text-center"
                    />
                  </td>
                  <td className="px-2 py-1">₦{item.price}</td>
                  <td className="px-2 py-1">₦{item.price * item.quantity}</td>
                  <td className="px-2 py-1">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 p-4 bg-gray-700 rounded space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7.5%):</span>
              <span>₦{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Actions */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded font-semibold">
            Save Changes
          </button>
          <button className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 rounded font-semibold">
            Cancel Adjustments
          </button>
          <button className="w-full py-2 bg-red-600 hover:bg-red-500 rounded font-semibold">
            Remove All Items
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdjustQty;
