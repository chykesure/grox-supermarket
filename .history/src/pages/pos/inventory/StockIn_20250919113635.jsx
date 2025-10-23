import React, { useState, useEffect } from "react";

function StockIn() {
  // Example suppliers
  const suppliers = [
    { id: 1, name: "Dairy Co." },
    { id: 2, name: "Bakery Supplies" },
  ];

  // Example products
  const initialProducts = [
    { id: 1, name: "Milk 1L", category: "Dairy", stock: 10, price: 200 },
    { id: 2, name: "Bread", category: "Bakery", stock: 20, price: 150 },
    { id: 3, name: "Eggs (12pcs)", category: "Dairy", stock: 15, price: 500 },
  ];

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [products, setProducts] = useState(initialProducts);
  const [stockInItems, setStockInItems] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ type: "", message: "", visible: false });

  // Filtered products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add product to stock-in list
  const addProductToStockIn = (product) => {
    if (!stockInItems.find((item) => item.id === product.id)) {
      setStockInItems([...stockInItems, { ...product, qty: 1, discount: 0, vat: 0 }]);
    }
  };

  // Update quantity, discount, VAT
  const updateStockInItem = (id, key, value) => {
    setStockInItems(
      stockInItems.map((item) =>
        item.id === id ? { ...item, [key]: Number(value) } : item
      )
    );
  };

  // Calculate total for a single item
  const calculateTotal = (item) => {
    const base = item.price * item.qty;
    const discountAmount = (base * item.discount) / 100;
    const vatAmount = ((base - discountAmount) * item.vat) / 100;
    return base - discountAmount + vatAmount;
  };

  // Grand totals
  const subtotal = stockInItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalDiscount = stockInItems.reduce(
    (acc, item) => acc + (item.price * item.qty * item.discount) / 100,
    0
  );
  const totalVAT = stockInItems.reduce(
    (acc, item) => acc + ((item.price * item.qty - (item.price * item.qty * item.discount) / 100) * item.vat) / 100,
    0
  );
  const grandTotal = subtotal - totalDiscount + totalVAT;

  // Show toast
  const showToast = (type, message) => {
    setToast({ type, message, visible: true });
    setTimeout(() => setToast({ type, message, visible: false }), 3000);
  };

  // Confirm Stock-In
  const confirmStockIn = () => {
    if (!selectedSupplier || !invoiceNumber || stockInItems.length === 0) {
      showToast("error", "Please select supplier, invoice number, and add at least one product.");
      return;
    }

    // Update stock for each product
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
        grandTotal,
      },
    ]);

    // Reset stock-in form
    setStockInItems([]);
    setInvoiceNumber("");
    setSelectedSupplier("");
    showToast("success", "Stock-In recorded successfully!");
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Toast Message */}
      {toast.visible && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Supplier & Invoice */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <div>
          <label className="block text-gray-300">Supplier</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Invoice Number</label>
          <input
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
            placeholder="Enter Invoice #"
          />
        </div>
        <div>
          <label className="block text-gray-300">Invoice Date</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
          />
        </div>
      </div>

      {/* Product Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-1/3"
        />
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
              <th className="px-4 py-2 text-center">Qty</th>
              <th className="px-4 py-2 text-center">Price</th>
              <th className="px-4 py-2 text-center">Discount %</th>
              <th className="px-4 py-2 text-center">VAT %</th>
              <th className="px-4 py-2 text-center">Total</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((p) => {
              const isAdded = !!stockInItems.find((item) => item.id === p.id);
              const stockItem = stockInItems.find((item) => item.id === p.id) || { qty: 0, discount: 0, vat: 0 };
              return (
                <tr key={p.id} className="hover:bg-gray-700">
                  <td className="px-2 py-1">{p.name}</td>
                  <td className="px-2 py-1">{p.category}</td>
                  <td className="px-2 py-1 text-center font-bold">{p.stock}</td>
                  <td className="px-2 py-1 text-center">
                    <input
                      type="number"
                      min="0"
                      value={stockItem.qty}
                      onChange={(e) => {
                        if (e.target.value < 0) return;
                        addProductToStockIn(p);
                        updateStockInItem(p.id, "qty", e.target.value);
                      }}
                      className="w-16 p-1 rounded bg-gray-700 text-white text-center"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">{p.price}</td>
                  <td className="px-2 py-1 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={stockItem.discount}
                      onChange={(e) => updateStockInItem(p.id, "discount", e.target.value)}
                      className="w-16 p-1 rounded bg-gray-700 text-white text-center"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={stockItem.vat}
                      onChange={(e) => updateStockInItem(p.id, "vat", e.target.value)}
                      className="w-16 p-1 rounded bg-gray-700 text-white text-center"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">{calculateTotal(stockItem)}</td>
                  <td className="px-2 py-1 text-center">
                    <button
                      onClick={() =>
                        isAdded
                          ? setStockInItems(stockInItems.filter((item) => item.id !== p.id))
                          : addProductToStockIn(p)
                      }
                      className={`p-1 rounded ${
                        isAdded ? "bg-green-500 hover:bg-green-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isAdded ? "Added" : "Add"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary & Confirm */}
      <div className="flex justify-end items-center gap-6">
        <div className="space-y-1 text-right">
          <div>Subtotal: ₦{subtotal}</div>
          <div>Discount: ₦{totalDiscount}</div>
          <div>VAT: ₦{totalVAT}</div>
          <div className="font-bold text-green-400">Grand Total: ₦{grandTotal}</div>
        </div>
        <button
          onClick={confirmStockIn}
          className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Confirm Stock-In
        </button>
      </div>

      {/* Stock-In Summary */}
      {stockHistory.length > 0 && (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6 overflow-auto">
    <h2 className="text-green-400 font-semibold mb-4">Stock-In Summary</h2>
    <table className="w-full table-fixed border-collapse">
      <thead className="bg-gray-900">
        <tr>
          <th className="px-4 py-2 text-left w-1/6">Supplier</th>
          <th className="px-4 py-2 text-left w-1/6">Invoice #</th>
          <th className="px-4 py-2 text-left w-1/6">Date</th>
          <th className="px-4 py-2 text-left w-2/6">Products</th>
          <th className="px-4 py-2 text-right w-1/6">Grand Total</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {stockHistory.map((h, idx) => (
          <tr key={idx} className="hover:bg-gray-700">
            <td className="px-4 py-2 text-left">{h.supplier}</td>
            <td className="px-4 py-2 text-left">{h.invoiceNumber}</td>
            <td className="px-4 py-2 text-left">{h.invoiceDate}</td>
            <td className="px-4 py-2 text-left">
              {h.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
            </td>
            <td className="px-4 py-2 text-right">₦{h.grandTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
}

export default StockIn;
