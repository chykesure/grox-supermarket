import React, { useState } from "react";

// ✅ Simple Toast Component
function Toast({ message, type }) {
  return (
    <div
      className={`fixed top-5 right-5 z-[9999] px-4 py-2 rounded-lg shadow-lg text-white ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      } animate-fadeInOut`}
    >
      {message}
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

    const existing = stockInItems.find((item) => item.id === Number(selectedProduct));
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
    <div className="p-6">
      {/* Toast */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <h1 className="text-2xl font-bold mb-4">Stock-In</h1>

      {/* Supplier & Invoice */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Add Product */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border p-2 rounded flex-1"
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
          className="border p-2 rounded w-32"
        />

        <button
          onClick={addStockItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      {/* Stock-In Table */}
      {stockInItems.length > 0 && (
        <table className="w-full border mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {stockInItems.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.qty}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => removeStockItem(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirm Button */}
      <button
        onClick={confirmStockIn}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Confirm Stock-In
      </button>

      {/* Stock History */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Stock-In History</h2>
      {stockHistory.length === 0 ? (
        <p className="text-gray-600">No stock-in records yet.</p>
      ) : (
        stockHistory.map((h, i) => (
          <div key={i} className="border p-4 rounded mb-3 bg-gray-50">
            <p>
              <strong>Supplier:</strong> {h.supplier}
            </p>
            <p>
              <strong>Invoice:</strong> {h.invoiceNumber} ({h.invoiceDate})
            </p>
            <ul className="list-disc ml-6 mt-2">
              {h.items.map((it, idx) => (
                <li key={idx}>
                  {it.name} - {it.qty}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

// ✅ Animation for Toast
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
