// src/pages/reports/SalesReport.jsx
import React from "react";

function SalesReport() {
  const salesData = [
    { id: 1, date: "2025-09-20", invoice: "INV-001", customer: "John Doe", total: 2500, status: "Paid" },
    { id: 2, date: "2025-09-21", invoice: "INV-002", customer: "Jane Smith", total: 1800, status: "Pending" },
    { id: 3, date: "2025-09-22", invoice: "INV-003", customer: "Samuel Green", total: 4200, status: "Paid" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-xl font-semibold text-blue-400">Sales Report</h2>
      <p className="text-gray-400">Track sales transactions, invoices, and status.</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-sm">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Invoice</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-right">Total (₦)</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((row) => (
              <tr key={row.id} className="border-b border-gray-700 text-gray-200">
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.invoice}</td>
                <td className="px-4 py-2">{row.customer}</td>
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
