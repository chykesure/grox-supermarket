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
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deleteModal, setDeleteModal] = useState({ visible: false, index: null });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState(null);

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

  // Calculate totals
  const calculateTotal = (item) => item.price * item.qty;
  const grandTotal = stockOutItems.reduce((acc, item) => acc + calculateTotal(item), 0);

  // Confirm Stock-Out
  const confirmStockOut = () => {
    if (!requester || stockOutItems.length === 0) {
      setMessage({ type: "error", text: "Please enter requester and select at least one product." });
      return;
    }

    for (const item of stockOutItems) {
      const product = products.find((p) => p.id === item.id);
      if (item.qty > product.stock) {
        setMessage({ type: "error", text: `Not enough stock for ${item.name}. Available: ${product.stock}` });
        return;
      }
    }

    // Update stock
    const updatedProducts = products.map((p) => {
      const outItem = stockOutItems.find((item) => item.id === p.id);
      if (outItem) return { ...p, stock: p.stock - outItem.qty };
      return p;
    });
    setProducts(updatedProducts);

    // Save to history
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

    // Reset
    setStockOutItems([]);
    setRequester("");
    setReason("");
    setMessage({ type: "success", text: "Stock-Out recorded successfully!" });
  };

  // Delete record
  const deleteRecord = (index) => {
    const updated = [...stockOutHistory];
    updated.splice(index, 1);
    setStockOutHistory(updated);
    setDeleteModal({ visible: false, index: null });
  };

  // Edit record
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditData({ ...stockOutHistory[index] });
  };

  const saveEdit = () => {
    const updated = [...stockOutHistory];
    updated[editingIndex] = editData;
    setStockOutHistory(updated);
    setEditingIndex(null);
    setEditData(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditData(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Inline Message */}
      {message.text && (
        <div
          className={`p-3 rounded ${
            message.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
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
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center">Available</th>
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
                      if (value > p.stock) return;
                      addProductToStockOut(p);
                      updateStockOutItem(p.id, value);
                    }}
                    className="w-16 p-1 rounded bg-gray-700 text-white text-center"
                  />
                </td>
                <td className="px-2 py-1 text-center">₦{p.price}</td>
                <td className="px-2 py-1 text-center">
                  ₦{calculateTotal(stockOutItems.find((i) => i.id === p.id) || { price: p.price, qty: 0 })}
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    onClick={() => setStockOutItems(stockOutItems.filter((i) => i.id !== p.id))}
                    className="p-1 rounded bg-red-500 hover:bg-red-600 text-white"
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
        <div className="text-right font-bold text-green-400">
          Total Value: ₦{grandTotal}
        </div>
        <button
          onClick={confirmStockOut}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Confirm Stock-Out
        </button>
      </div>

      {/* Stock-Out History */}
      {stockOutHistory.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6 overflow-auto">
          <h2 className="text-green-400 font-semibold mb-4">Stock-Out Summary</h2>
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-2 w-1/6 text-left">Requester</th>
                <th className="px-4 py-2 w-1/6 text-left">Reason</th>
                <th className="px-4 py-2 w-1/6 text-left">Date</th>
                <th className="px-4 py-2 w-2/6 text-left">Products</th>
                <th className="px-4 py-2 w-1/6 text-right">Total Value</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {stockOutHistory.map((h, idx) => (
                <tr key={idx} className="hover:bg-gray-700">
                  {editingIndex === idx ? (
                    <>
                      <td className="px-2 py-1">
                        <input
                          value={editData.requester}
                          onChange={(e) =>
                            setEditData({ ...editData, requester: e.target.value })
                          }
                          className="w-full p-1 bg-gray-700 text-white rounded"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          value={editData.reason}
                          onChange={(e) =>
                            setEditData({ ...editData, reason: e.target.value })
                          }
                          className="w-full p-1 bg-gray-700 text-white rounded"
                        />
                      </td>
                      <td className="px-2 py-1">{editData.date}</td>
                      <td className="px-2 py-1">
                        {editData.items.map((i, idx) => (
                          <div key={idx}>
                            {i.name}{" "}
                            <input
                              type="number"
                              min="0"
                              value={i.qty}
                              onChange={(e) => {
                                const newItems = [...editData.items];
                                newItems[idx].qty = Number(e.target.value);
                                setEditData({ ...editData, items: newItems });
                              }}
                              className="w-16 p-1 bg-gray-700 text-white rounded ml-2"
                            />
                          </div>
                        ))}
                      </td>
                      <td className="px-2 py-1 text-right">₦{editData.totalValue}</td>
                      <td className="px-2 py-1 text-center space-x-2">
                        <button
                          onClick={saveEdit}
                          className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-2 py-1 bg-gray-500 text-white rounded"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 py-1">{h.requester}</td>
                      <td className="px-2 py-1">{h.reason}</td>
                      <td className="px-2 py-1">{h.date}</td>
                      <td className="px-2 py-1">
                        {h.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                      </td>
                      <td className="px-2 py-1 text-right">₦{h.totalValue}</td>
                      <td className="px-2 py-1 text-center space-x-2">
                        <button
                          onClick={() => startEdit(idx)}
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal({ visible: true, index: idx })}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Delete Modal */}
          {deleteModal.visible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold text-red-400 mb-4">Confirm Delete</h2>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this record?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteModal({ visible: false, index: null })}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteRecord(deleteModal.index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StockOut;
