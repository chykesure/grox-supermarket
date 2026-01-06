import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductLedger() {
  const [products, setProducts] = useState([]);
  const [ledgerData, setLedgerData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8080/api/product-ledger";

  // Load products
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

  // Fetch ledger
  useEffect(() => {
    if (!selectedProduct) return;

    const fetchLedger = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/${encodeURIComponent(selectedProduct)}`);
        setLedgerData(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product ledger");
        setLedgerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [selectedProduct]);

  const ledger = ledgerData?.ledger || [];
  const productName = ledgerData?.product || selectedProduct;
  const currentStock = ledgerData?.currentStock || 0;

  // Filter by supplier & date
  const filteredLedger = ledger
    .filter((row) => (selectedSupplier ? row.supplierName === selectedSupplier : true))
    .filter((row) => (startDate ? new Date(row.date) >= new Date(startDate) : true))
    .filter((row) => (endDate ? new Date(row.date) <= new Date(endDate) : true));

  // Recalculate running balance
  let runningBalance = 0;
  const filteredLedgerWithBalance = filteredLedger.map((row) => {
    runningBalance += row.quantityIn - row.quantityOut;
    return { ...row, balanceAfter: runningBalance };
  });

  // Unique suppliers
  const suppliers = [...new Set(ledger.map((l) => l.supplierName).filter(Boolean))];

  return (
    <div className="text-gray-200 p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-2">Product Ledger</h2>
      <p className="text-gray-400 mb-6">Track stock in / stock out per product.</p>

      {/* Product selection */}
      <div className="mb-4 w-1/3">
        <label className="block mb-1">Select Product</label>
        <select
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            setSelectedSupplier("");
          }}
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
          {/* Current stock */}
          <div className="bg-blue-900/20 border border-blue-700 rounded p-4 mb-6 text-center">
            <h3 className="text-lg font-semibold">{productName}</h3>
            <p className="text-3xl font-bold mt-2">{currentStock}</p>
            <p className="text-sm text-gray-400">Current Stock Balance</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-4 flex-wrap">
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
            <h4 className="text-sm text-gray-400">Visible Entries</h4>
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
                    <td colSpan="8" className="text-center py-8 text-gray-400">
                      Loading ledger...
                    </td>
                  </tr>
                ) : filteredLedgerWithBalance.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-400">
                      No ledger entries found
                    </td>
                  </tr>
                ) : (
                  filteredLedgerWithBalance.map((row, i) => {
                    const isReturn = row.note?.toLowerCase().includes("return");
                    return (
                      <tr
                        key={i}
                        className={`border-t border-gray-700 hover:bg-gray-800/40 ${isReturn
                          ? "bg-yellow-900/10"
                          : row.type === "IN"
                            ? "bg-green-900/10"
                            : "bg-red-900/10"
                          }`}
                      >
                        <td className="px-4 py-2">{new Date(row.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${isReturn
                              ? "bg-yellow-600 text-yellow-100"
                              : row.type === "IN"
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                              }`}
                          >
                            {isReturn ? "RETURN" : row.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{row.referenceNumber || "—"}</td>
                        <td className="px-4 py-2 text-center font-medium">
                          {typeof row.quantityIn === "number" ? row.quantityIn : "—"}
                        </td>
                        <td className="px-4 py-2 text-center font-medium text-red-400">
                          {typeof row.quantityOut === "number" ? row.quantityOut : "—"}
                        </td>
                        <td className="px-4 py-2">{row.supplierName || "—"}</td>
                        <td className="px-4 py-2">{row.cashier || "—"}</td>
                        <td className="px-4 py-2 font-bold text-center text-lg">{row.balanceAfter}</td>
                      </tr>
                    );
                  })
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
