// src/pages/pos/sales/ScanItems.jsx
import React, { useState } from "react";

function ScanItems() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcode, setBarcode] = useState("");

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
    if (qty < 1) return;
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  // Inline SVGs
  const PlusIcon = () => (
    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );

  const MinusIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );

  const TrashIcon = () => (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7L5 7m14 0l-1 12H6L5 7m3-4h8l1 4H7l1-4z" />
    </svg>
  );

  const CashIcon = () => (
    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M6 16h12M6 8h12" />
    </svg>
  );

  const XCircleIcon = () => (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const ShoppingCartIcon = () => (
    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 6H19M7 13l-2-6m0 0H3" />
    </svg>
  );

  return (
    <div className="flex flex-col  bg-gray-900 text-gray-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-gray-800 shadow-sm">
        <div className="font-semibold">Transaction #: <span className="text-blue-400">000123</span></div>
        <div className="text-gray-400">{new Date().toLocaleString()}</div>
        <div>Customer: <span className="text-yellow-400">Walk-in</span></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Product Search */}
        <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
            <ShoppingCartIcon /> Scan / Search Product
          </h2>
          <input
            type="text"
            placeholder="Scan Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full mb-2 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Search Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <h3 className="font-semibold mb-2 text-gray-300">Products</h3>
          <ul className="space-y-2">
            {products
              .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((product) => (
                <li
                  key={product.id}
                  className="p-2 bg-gray-700 rounded flex justify-between items-center hover:bg-gray-600 cursor-pointer transition"
                  onClick={() => addToCart(product)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-400">Stock: {product.stock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">₦{product.price}</span>
                    <PlusIcon />
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Center Panel - Cart */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
            <ShoppingCartIcon /> Cart
          </h2>
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Cart is empty</div>
          ) : (
            <div className="bg-gray-800 rounded shadow p-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-700 p-2 hover:bg-gray-700 rounded transition">
                  <div className="flex-1">{item.name}</div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><MinusIcon /></button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-12 p-1 text-center rounded bg-gray-700 border border-gray-600"
                    />
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><PlusIcon /></button>
                  </div>
                  <div className="w-20 text-right font-semibold">₦{item.price * item.quantity}</div>
                  <button onClick={() => removeFromCart(item.id)} className="ml-2"><TrashIcon /></button>
                </div>
              ))}
            </div>
          )}

          {/* Totals */}
          <div className="mt-4 p-4 bg-gray-700 rounded shadow space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7.5%):</span>
              <span>₦{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-green-400">
              <span>Total:</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Payment */}
        <div className="w-1/4 p-4 border-l border-gray-700 flex flex-col justify-between bg-gray-800">
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              <CashIcon /> Payment
            </h2>
            <div className="space-y-2">
              <label className="block">Cash Tendered</label>
              <input
                type="number"
                placeholder="₦0"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
              <label className="block">Change</label>
              <input
                type="number"
                placeholder="₦0"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                disabled
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button className="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-semibold flex items-center justify-center gap-2">
              <CashIcon /> Confirm Payment
            </button>
            <button className="w-full bg-red-600 hover:bg-red-500 py-2 rounded font-semibold flex items-center justify-center gap-2">
              <XCircleIcon /> Cancel Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanItems;
