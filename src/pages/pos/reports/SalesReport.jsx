// src/pages/reports/SalesReport.jsx
import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function SalesReport() {
  const salesData = [
    { id: 1, date: "2025-09-20", invoice: "INV-001", customer: "John Doe", total: 2500, status: "Paid" },
    { id: 2, date: "2025-09-21", invoice: "INV-002", customer: "Jane Smith", total: 1800, status: "Pending" },
    { id: 3, date: "2025-09-22", invoice: "INV-003", customer: "Samuel Green", total: 4200, status: "Paid" },
  ];

  // 📊 Totals
  const grandTotal = salesData.reduce((sum, row) => sum + row.total, 0);

  // 🏆 Largest sale
  const biggestSale = salesData.reduce(
    (max, row) => (row.total > max.total ? row : max),
    salesData[0]
  );

  // 📥 Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(salesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, "SalesReport.xlsx");
  };

  // 📥 Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 15);
    doc.autoTable({
      head: [["Date", "Invoice", "Customer", "Total (₦)", "Status"]],
      body: salesData.map((row) => [
        row.date,
        row.invoice,
        row.customer,
        `₦${row.total.toLocaleString()}`,
        row.status,
      ]),
      foot: [["", "", "TOTAL", `₦${grandTotal.toLocaleString()}`, ""]],
      startY: 20,
    });
    doc.save("SalesReport.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-400">Sales Report</h2>
        <p className="text-gray-400">Track sales transactions, invoices, and status.</p>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
        >
          Export Excel
        </button>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
        >
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-sm">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-right">Total (₦)</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-gray-700 text-gray-200 hover:bg-gray-800 transition ${
                  row.id === biggestSale.id ? "bg-blue-900/40" : ""
                }`}
              >
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.invoice}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  {row.customer}
                  {row.id === biggestSale.id && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded">
                      🏆 Highest Sale
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">₦{row.total.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      row.status === "Paid"
                        ? "bg-green-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
            {salesData.length > 0 && (
              <tr className="bg-gray-900 font-semibold text-gray-300">
                <td className="px-4 py-3 text-right" colSpan="3">
                  TOTAL
                </td>
                <td className="px-4 py-3 text-right">₦{grandTotal.toLocaleString()}</td>
                <td></td>
              </tr>
            )}
            {salesData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No sales records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesReport;
