// src/pages/pos/sales/ScanItems.jsx
import React, { useState } from "react";

function ScanItems() {
  // Cart state
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcode, setBarcode] = useState("");

  // Dummy product list (replace with backend fetch later)
  const products = [
    { id: 1, name: "Milk 1L", price: 200, stock: 10 },
    { id: 2, name: "Bread", price: 150, stock: 20 },
    { id: 3, name: "Eggs (12pcs)", price: 500, stock: 15 },
  ];

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  // Totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.075; // 7.5% tax example
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <div>Transaction #: 000123</div>
        <div>{new Date().toLocaleString()}</div>
        <div>Customer: Walk-in</div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Product Search */}
        <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Scan / Search Product</h2>

          <input
            type="text"
            placeholder="Scan Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Search Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500"
          />

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Products</h3>
            <ul className="space-y-2">
              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((product) => (
                  <li
                    key={product.id}
                    className="p-2 bg-gray-800 rounded flex justify-between items-center hover:bg-gray-700 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <span>{product.name}</span>
                    <span>₦{product.price}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Center Panel - Cart */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Cart</h2>
          <table className="w-full table-auto border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-2 py-1 border-b border-gray-700">Item</th>
                <th className="px-2 py-1 border-b border-gray-700">Qty</th>
                <th className="px-2 py-1 border-b border-gray-700">Price</th>
                <th className="px-2 py-1 border-b border-gray-700">Total</th>
                <th className="px-2 py-1 border-b border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
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
                      className="w-16 p-1 rounded bg-gray-800 border border-gray-600 text-center"
                    />
                  </td>
                  <td className="px-2 py-1">₦{item.price}</td>
                  <td className="px-2 py-1">₦{item.price * item.quantity}</td>
                  <td className="px-2 py-1">
                    <button
                      onClick={() => removeFromCart(item.id)}
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
          <div className="mt-4 p-4 bg-gray-800 rounded space-y-2">
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

        {/* Right Panel - Payment */}
        <div className="w-1/4 p-4 border-l border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4">Payment</h2>

            <div className="space-y-2">
              <label className="block">Cash Tendered</label>
              <input
                type="number"
                placeholder="₦0"
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500"
              />

              <label className="block">Change</label>
              <input
                type="number"
                placeholder="₦0"
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500"
                disabled
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button className="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-semibold">
              Confirm Payment
            </button>
            <button className="w-full bg-red-600 hover:bg-red-500 py-2 rounded font-semibold">
              Cancel Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanItems;
