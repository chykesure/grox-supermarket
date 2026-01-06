// src/pages/pos/reports/RevenueReport.jsx
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

function RevenueReport() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // -----------------------------
  // Fetch sales + returns data
  // -----------------------------
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/sales"); // Update API URL
        setSalesData(res.data.data || []);
      } catch (err) {
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  // -----------------------------
  // Filter by date
  // -----------------------------
  const filteredData = salesData.filter((row) => {
    if (!startDate && !endDate) return true;
    const rowDate = new Date(row.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end) return rowDate >= start && rowDate <= end;
    if (start) return rowDate >= start;
    if (end) return rowDate <= end;
    return true;
  });

  // -----------------------------
  // Calculations
  // -----------------------------
  const totals = filteredData.reduce(
    (acc, row) => {
      const rowSales = parseFloat(row.saleAmount) || 0;
      const rowCost = parseFloat(row.costAmount) || 0;
      const rowRefund = parseFloat(row.totalRefund) || 0;

      acc.totalSales += rowSales;
      acc.totalCost += rowCost;
      acc.totalProfit += rowSales - rowCost;
      acc.totalReturns += rowRefund;
      return acc;
    },
    { totalSales: 0, totalCost: 0, totalProfit: 0, totalReturns: 0 }
  );

  const formatCurrency = (amount) =>
    "₦" + amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  // -----------------------------
  // Export Excel
  // -----------------------------
  const exportToExcel = () => {
    const data = filteredData.map((row) => ({
      "Date & Time": formatDate(row.date),
      "Invoice No": row.invoiceNumber,
      "Total Sale (₦)": formatCurrency(row.saleAmount || 0),
      "Total Cost (₦)": formatCurrency(row.costAmount || 0),
      "Profit (₦)": formatCurrency((row.saleAmount || 0) - (row.costAmount || 0)),
      "Total Returns (₦)": formatCurrency(row.totalRefund || 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Report");
    XLSX.writeFile(workbook, "revenue_report.xlsx");
  };

  // -----------------------------
  // Export PDF
  // -----------------------------
  const exportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");
    doc.text("Revenue Report", 14, 15);

    doc.autoTable({
      startY: 25,
      head: [["Date & Time", "Invoice", "Sale (₦)", "Cost (₦)", "Profit (₦)", "Returns (₦)"]],
      body: filteredData.map((row) => [
        formatDate(row.date),
        row.invoiceNumber,
        formatCurrency(row.saleAmount || 0),
        formatCurrency(row.costAmount || 0),
        formatCurrency((row.saleAmount || 0) - (row.costAmount || 0)),
        formatCurrency(row.totalRefund || 0),
      ]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("revenue_report.pdf");
  };

  // -----------------------------
  // UI States
  // -----------------------------
  if (loading) return <div className="py-12 text-center text-gray-400">Loading revenue data...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;
  if (salesData.length === 0) return <div className="py-12 text-center text-gray-500">No sales records found</div>;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-500">💰 Revenue Report</h2>
          <p className="text-gray-400 text-sm mt-1">
            Track sales, cost, profit & returns. Filter by date range.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex gap-3 items-end mb-4">
        <div>
          <label className="block text-sm text-gray-400">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 p-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 p-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
          />
        </div>

        <button
          onClick={() => { setStartDate(""); setEndDate(""); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Reset
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
          <p className="text-gray-400 text-sm">Total Sales</p>
          <p className="text-2xl font-bold text-green-400 mt-2">{formatCurrency(totals.totalSales)}</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
          <p className="text-gray-400 text-sm">Total Cost</p>
          <p className="text-2xl font-bold text-yellow-400 mt-2">{formatCurrency(totals.totalCost)}</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
          <p className="text-gray-400 text-sm">Total Profit</p>
          <p className="text-2xl font-bold text-blue-400 mt-2">{formatCurrency(totals.totalProfit)}</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
          <p className="text-gray-400 text-sm">Total Returns</p>
          <p className="text-2xl font-bold text-red-400 mt-2">{formatCurrency(totals.totalReturns)}</p>
        </div>
      </div>
    </div>
  );
}

export default RevenueReport;
