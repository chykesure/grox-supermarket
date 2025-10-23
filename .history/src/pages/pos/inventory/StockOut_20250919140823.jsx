import React, { useState } from "react";

// ✅ Modern Toast Component with Icons
function Toast({ message, type }) {
  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      } animate-fadeInOut`}
    >
      {type === "success" ? "✅" : "⚠️"} {message}
    </div>
  );
}

export default function StockInPage() {
  // Dummy suppliers & products
  const [suppliers] = useState([
    { id: 1, name: "Dairy Co." },
    { id: 2, name: "Bakery Supplies" },
  ]);
  const [products, setProducts] = useState([
    { id: 1, name: "Milk", stock: 10 },
    { id: 2, name: "Bread", stock: 20 },
    { id: 3, name: "Butter", stock: 15 },
  ]);

  // Stock-in states
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [stockInItems, setStockInItems] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);

  // Toast states
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 2500);
  };

  // ✅ Add product to Stock-In list
  const addStockItem = () => {
    if (!selectedProduct || qty <= 0) {
      showToast("error", "Please select a product and valid quantity.");
      return;
    }

    const existing = stockInItems.find(
      (item) => item.id === Number(selectedProduct)
    );
    if (existing) {
      const updated = stockInItems.map((item) =>
        item.id === Number(selectedProduct)
          ? { ...item, qty: item.qty + qty }
          : item
      );
      setStockInItems(updated);
    } else {
      const product = products.find((p) => p.id === Number(selectedProduct));
      setStockInItems([...stockInItems, { ...product, qty }]);
    }

    setSelectedProduct("");
    setQty(1);
    showToast("success", "Product added to Stock-In list.");
  };

  // ✅ Remove product row
  const removeStockItem = (id) => {
    setStockInItems(stockInItems.filter((item) => item.id !== id));
  };

  // ✅ Confirm Stock-In
  const confirmStockIn = () => {
    if (!selectedSupplier || !invoiceNumber || stockInItems.length === 0) {
      showToast(
        "error",
        "Please select supplier, invoice number, and add at least one product."
      );
      return;
    }

    // Update product stock
    const updatedProducts = products.map((p) => {
      const stockItem = stockInItems.find((item) => item.id === p.id);
      if (stockItem) return { ...p, stock: p.stock + stockItem.qty };
      return p;
    });
    setProducts(updatedProducts);

    // Add to history
    setStockHistory([
      ...stockHistory,
      {
        supplier: suppliers.find((s) => s.id === Number(selectedSupplier)).name,
        invoiceNumber,
        invoiceDate,
        items: stockInItems,
      },
    ]);

    // Reset form
    setStockInItems([]);
    setInvoiceNumber("");
    setSelectedSupplier("");
    setInvoiceDate("");
    showToast("success", "Stock-In recorded successfully!");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Toast */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Stock-In</h1>

      {/* Supplier & Invoice */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Invoice Number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Add Product */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none flex-1"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="p-3 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none w-32"
        />

        <button
          onClick={addStockItem}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          ➕ Add Item
        </button>
      </div>

      {/* Stock-In Table */}
      {stockInItems.length > 0 && (
        <div className="overflow-auto rounded-lg shadow border border-gray-200 mb-6">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockInItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.qty}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeStockItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={confirmStockIn}
        className="bg-green-600 text-white px-8 py-3 rounded-lg shadow hover:bg-green-700 transition"
      >
        ✅ Confirm Stock-In
      </button>

      {/* Stock History */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">
        📜 Stock-In History
      </h2>
      {stockHistory.length === 0 ? (
        <p className="text-gray-600">No stock-in records yet.</p>
      ) : (
        <div className="space-y-4">
          {stockHistory.map((h, i) => (
            <div
              key={i}
              className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
            >
              <p className="text-gray-700">
                <strong>Supplier:</strong>{" "}
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                  {h.supplier}
                </span>
              </p>
              <p className="text-gray-700 mt-1">
                <strong>Invoice:</strong> {h.invoiceNumber} ({h.invoiceDate})
              </p>
              <ul className="list-disc ml-6 mt-2 text-gray-600">
                {h.items.map((it, idx) => (
                  <li key={idx}>
                    {it.name} - <span className="font-semibold">{it.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Toast Animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}
.animate-fadeInOut {
  animation: fadeInOut 2.5s ease-in-out forwards;
}
`;
document.head.appendChild(style);
