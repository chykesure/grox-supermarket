import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const formatMoney = (amount) =>
  `₦${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-GB");
};

const StockList = ({ refreshSignal }) => {
  const [supplierSummary, setSupplierSummary] = useState([]);
  const [ledgerRecords, setLedgerRecords] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [searchRef, setSearchRef] = useState("");

  const fetchSupplierSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await axios.get("http://localhost:8080/stock/supplier-summary");
      setSupplierSummary(res.data);
    } catch (err) {
      console.error("Error fetching supplier summary:", err);
      toast.error("Failed to fetch supplier summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchLedgerRecords = async () => {
    setLoadingRecords(true);
    try {
      const res = await axios.get("http://localhost:8080/stock");
      setLedgerRecords(res.data);
    } catch (err) {
      console.error("Error fetching ledger records:", err);
      toast.error("Failed to fetch detailed records.");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchSupplierSummary();
    fetchLedgerRecords();
  }, [refreshSignal]);

  const getId = (id) => (typeof id === "string" ? id : id?._id?.toString() || "");

  // Click handler
  const handleSummaryClick = (summary) => {
    const summarySupplierId = getId(summary.supplierId);
    const selectedSupplierId = getId(selectedSummary?.supplierId);

    const summaryRef = (summary.referenceNumber || "").trim().toLowerCase();
    const selectedRef = (selectedSummary?.referenceNumber || "").trim().toLowerCase();

    setSelectedSummary(
      selectedSummary &&
        selectedSupplierId === summarySupplierId &&
        selectedRef === summaryRef
        ? null
        : summary
    );
  };

  // Filter ledger records
  const filteredRecords = selectedSummary
    ? ledgerRecords.filter((r) => {
      const ledgerSupplierId = getId(r.supplierId);
      const summarySupplierId = getId(selectedSummary.supplierId);

      const ledgerRef = (r.referenceNumber || "").trim().toLowerCase();
      const summaryRef = (selectedSummary.referenceNumber || "").trim().toLowerCase();

      return ledgerSupplierId === summarySupplierId && ledgerRef === summaryRef;
    })
    : ledgerRecords;


  // 🔍 Filter supplier summary by reference search
  const filteredSummary = supplierSummary.filter((s) =>
    s.referenceNumber?.toLowerCase().includes(searchRef.toLowerCase())
  );


  return (
    <div className="space-y-10 p-4">
      {/* ======================== Supplier Summary ======================== */}
      <div>
        <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
          Supplier Stock Summary (from Ledger)
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Reference Number..."
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 w-full md:w-1/3"
          />
        </div>

        {loadingSummary ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-gray-500" size={28} />
          </div>
        ) : filteredSummary.length === 0 ? (
          <div className="text-gray-400">No supplier summary data found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg text-gray-300">
              <thead className="bg-gray-800 text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-2 text-center w-12">S/N</th>
                  <th className="px-4 py-2">Supplier Name</th>
                  <th className="px-4 py-2 text-right">Products</th>
                  <th className="px-4 py-2 text-right">Qty Added</th>
                  <th className="px-4 py-2 text-right">Total Cost</th>
                  <th className="px-4 py-2 text-right">Total Selling Value</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Ref No</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map((supplier, index) => (
                  <tr
                    key={`${supplier.supplierId}-${supplier.referenceNumber}`}
                    className={`border-b border-gray-700 cursor-pointer hover:bg-gray-800/50 ${selectedSummary &&
                      selectedSummary.supplierId === supplier.supplierId &&
                      selectedSummary.referenceNumber === supplier.referenceNumber
                      ? "bg-gray-800/70"
                      : ""
                      }`}
                    onClick={() => handleSummaryClick(supplier)}
                  >
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2">{supplier.supplierName || "—"}</td>
                    <td className="px-4 py-2 text-right">
                      {supplier.productCount || 0}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {supplier.totalQuantityAdded || 0}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatMoney(supplier.totalCostValue)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatMoney(supplier.totalSellingValue)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formatDate(supplier.lastTransactionDate)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {supplier.referenceNumber || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================== Detailed Ledger Records ======================== */}
      <div>
        <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
          Detailed Stock Transactions
        </h2>

        {selectedSummary && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Filter Active:</span>
              <span className="bg-emerald-700/30 text-emerald-400 text-sm px-3 py-1 rounded-full font-medium">
                {selectedSummary.supplierName} - {selectedSummary.referenceNumber}
              </span>
            </div>

            <button
              onClick={() => setSelectedSummary(null)}
              className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded-lg transition"
            >
              Clear Filter ✕
            </button>
          </div>
        )}

        {loadingRecords ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-gray-500" size={28} />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-gray-400">No transaction records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg text-gray-300">
              <thead className="bg-gray-800 text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-2 text-center w-12">S/N</th>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Supplier</th>
                  <th className="px-4 py-2 text-right">Qty Added</th>
                  <th className="px-4 py-2 text-right">Balance After</th>
                  <th className="px-4 py-2 text-right">Cost Price</th>
                  <th className="px-4 py-2 text-right">Selling Price</th>
                  <th className="px-4 py-2 text-center">Type</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Ref No</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((s, index) => (
                  <tr
                    key={s._id}
                    className="border-b border-gray-700 hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2">{s.productName || "—"}</td>
                    <td className="px-4 py-2">{s.supplierName || "—"}</td>
                    <td className="px-4 py-2 text-right">
                      {s.quantityAdded || 0}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {s.balanceAfterStock || 0}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatMoney(s.costPrice)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatMoney(s.sellingPrice)}
                    </td>
                    <td className="px-4 py-2 text-center capitalize">
                      {s.type || "—"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formatDate(s.date)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {s.referenceNumber || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList;
