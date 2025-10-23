import React, { useState } from "react";

function StockOut() {
  // Example products
  const initialProducts = [
    { id: 1, name: "Milk 1L", category: "Dairy", stock: 10, price: 200 },
    { id: 2, name: "Bread", category: "Bakery", stock: 20, price: 150 },
    { id: 3, name: "Eggs (12pcs)", category: "Dairy", stock: 15, price: 500 },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [stockOutItems, setStockOutItems] = useState([]);
  const [requester, setRequester] = useState("");
  const [reason, setReason] = useState("");
  const [stockOutHistory, setStockOutHistory] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" }); // inline message

  // Add product to stock-out list
  const addProductToStockOut = (product) => {
    if (!stockOutItems.find((item) => item.id === product.id)) {
      setStockOutItems([...stockOutItems, { ...product, qty: 1 }]);
    }
  };

  // Update quantity
  const updateStockOutItem = (id, value) => {
    const qty = Number(value);
    setStockOutItems(
      stockOutItems.map((item) =>
        item.id === id ? { ...item, qty: qty < 0 ? 0 : qty } : item
      )
    );
  };

  // Calculate total value per item
  const calculateTotal = (item) => item.price * item.qty;

  // Calculate grand total
  const grandTotal = stockOutItems.reduce((acc, item) => acc + calculateTotal(item), 0);

  // Confirm Stock-Out
  const confirmStockOut = () => {
    if (!requester || stockOutItems.length === 0) {
      setMessage({ type: "error", text: "Please enter requester and select at least one product." });
      return;
    }

    // Check for stock availability
    for (const item of stockOutItems) {
      const product = products.find((p) => p.id === item.id);
      if (item.qty > product.stock) {
        setMessage({ type: "error", text: `Not enough stock for ${item.name}. Available: ${product.stock}` });
        return;
      }
    }

    // Update product stock
    const updatedProducts = products.map((p) => {
      const outItem = stockOutItems.find((item) => item.id === p.id);
      if (outItem) return { ...p, stock: p.stock - outItem.qty };
      return p;
    });
    setProducts(updatedProducts);

    // Add to stock-out history
    setStockOutHistory([
      ...stockOutHistory,
      {
        requester,
        reason,
        date: new Date().toISOString().slice(0, 10),
        items: stockOutItems,
        totalValue: grandTotal,
      },
    ]);

    // Reset form
    setStockOutItems([]);
    setRequester("");
    setReason("");
    setMessage({ type: "success", text: "Stock-Out recorded successfully!" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Inline message */}
      {message.text && (
        <div
          className={`p-3 rounded ${
            message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Requester & Reason */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <div>
          <label className="block text-gray-300">Requester</label>
          <input
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
            placeholder="Enter requester name"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-300">Reason</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
            placeholder="Reason for stock-out"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-auto bg-gray-800 rounded-lg p-4 shadow-md">
        <h2 className="text-green-400 font-semibold mb-4">Products</h2>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center">Current Stock</th>
              <th className="px-4 py-2 text-center">Qty to Remove</th>
              <th className="px-4 py-2 text-center">Price</th>
              <th className="px-4 py-2 text-center">Total</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-700">
                <td className="px-2 py-1">{p.name}</td>
                <td className="px-2 py-1">{p.category}</td>
                <td className="px-2 py-1 text-center font-bold">{p.stock}</td>
                <td className="px-2 py-1 text-center">
                  <input
                    type="number"
                    min="0"
                    max={p.stock}
                    value={stockOutItems.find((item) => item.id === p.id)?.qty || 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value > p.stock) return; // cannot exceed available stock
                      addProductToStockOut(p);
                      updateStockOutItem(p.id, value);
                    }}
                    className="w-16 p-1 rounded bg-gray-700 text-white text-center"
                  />
                </td>
                <td className="px-2 py-1 text-center">{p.price}</td>
                <td className="px-2 py-1 text-center">
                  {calculateTotal(stockOutItems.find((item) => item.id === p.id) || { price: p.price, qty: 0 })}
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    onClick={() => setStockOutItems(stockOutItems.filter((item) => item.id !== p.id))}
                    className="p-1 rounded bg-red-500 hover:bg-red-700 text-white"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary & Confirm */}
      <div className="flex justify-end items-center gap-6">
        <div className="space-y-1 text-right">
          <div className="font-bold text-green-400">Total Value: ₦{grandTotal}</div>
        </div>
        <button
          onClick={confirmStockOut}
          className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
        >
          Confirm Stock-Out
        </button>
      </div>

      {/* Stock-Out History */}
      {stockOutHistory.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-green-400 font-semibold mb-4">Stock-Out History</h2>
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-2">Requester</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Products</th>
                <th className="px-4 py-2">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {stockOutHistory.map((h, idx) => (
                <tr key={idx} className="hover:bg-gray-700">
                  <td className="px-2 py-1">{h.requester}</td>
                  <td className="px-2 py-1">{h.reason}</td>
                  <td className="px-2 py-1">{h.date}</td>
                  <td className="px-2 py-1">
                    {h.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                  </td>
                  <td className="px-2 py-1">₦{h.totalValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StockOut;
