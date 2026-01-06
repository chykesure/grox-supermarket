import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductLedger() {
  const [products, setProducts] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8080/api/product-ledger";

  // Load product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products");
        setProducts(res.data);

        if (res.data.length > 0 && !selectedProduct) {
          setSelectedProduct(res.data[0].name);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // Fetch ledger for selected product
  useEffect(() => {
    if (!selectedProduct) return;

    const fetchLedger = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/${encodeURIComponent(selectedProduct)}`
        );
        setLedger(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product ledger");
        setLedger([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [selectedProduct]);

  // Create a set of all sale invoice numbers (OUT rows only)
  const saleInvoiceNumbers = new Set(
    ledger
      .filter((row) => row.type === "OUT")
      .map((row) => row.referenceNumber)
  );

  // Apply filters
  const filteredLedger = ledger
    .filter((row) =>
      selectedSupplier ? row.supplierName === selectedSupplier : true
    )
    .filter((row) =>
      startDate ? new Date(row.date) >= new Date(startDate) : true
    )
    .filter((row) =>
      endDate ? new Date(row.date) <= new Date(endDate) : true
    )
    .filter((row) => {
      // Determine if this row is a return
      const isReturn = row.note?.toLowerCase().includes("return");

      // Hide normal IN rows that match a sale invoice number
      if (row.type === "IN" && saleInvoiceNumbers.has(row.referenceNumber) && !isReturn) {
        return false;
      }

      return true; // keep all others
    });

  // 3️⃣ Recalculate dynamic running balance based on filtered rows
  let runningBalance = 0;
  const filteredLedgerWithBalance = filteredLedger.map(row => {
    if (row.type === "IN") runningBalance += row.quantityIn;
    if (row.type === "OUT") runningBalance -= row.quantityOut;
    return { ...row, balanceAfter: runningBalance };
  });

  const suppliers = [
    ...new Set(ledger.map((l) => l.supplierName).filter(Boolean)),
  ];

  return (
    <div className="text-gray-200 p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-2">Product Ledger</h2>
      <p className="text-gray-400 mb-6">
        Track stock in / stock out per product.
      </p>

      {/* Product selection */}
      <div className="mb-4 w-1/3">
        <label className="block mb-1">Select Product</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="">-- Choose Product --</option>
          {products.map((p) => (
            <option key={p._id} value={p.name}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <>
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block mb-1">Filter by Supplier</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              >
                <option value="">-- All Suppliers --</option>
                {suppliers.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            </div>

            <div>
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            </div>
          </div>

          {/* Entries count */}
          <div className="bg-gray-800 p-4 rounded text-center mb-6">
            <h4 className="text-sm text-gray-400">Entries</h4>
            <p className="text-xl font-bold">{filteredLedger.length}</p>
          </div>

          {/* Ledger table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-md">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Invoice / Ref</th>
                  <th className="px-4 py-2">Qty In</th>
                  <th className="px-4 py-2">Qty Out</th>
                  <th className="px-4 py-2">Supplier</th>
                  <th className="px-4 py-2">Cashier</th>
                  <th className="px-4 py-2">Balance</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-400">
                      No ledger history for this product
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-t border-gray-700 hover:bg-gray-800/40 ${row.note?.toLowerCase().includes("return")
                        ? "bg-yellow-900/10"
                        : row.type === "IN"
                          ? "bg-green-900/10"
                          : "bg-red-900/10"
                        }`}
                    >
                      <td className="px-4 py-2">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs ${row.note?.toLowerCase().includes("return")
                            ? "bg-yellow-600"
                            : row.type === "IN"
                              ? "bg-green-600"
                              : "bg-red-600"
                            }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-2">{row.referenceNumber || "—"}</td>
                      <td className="px-4 py-2 text-center">{row.quantityIn || "—"}</td>
                      <td className="px-4 py-2 text-center">{row.quantityOut || "—"}</td>
                      <td className="px-4 py-2">{row.supplierName || "Unknown"}</td>
                      <td className="px-4 py-2">{row.cashier || "—"}</td>
                      <td className="px-4 py-2 font-bold text-center">{row.balanceAfter}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductLedger;
