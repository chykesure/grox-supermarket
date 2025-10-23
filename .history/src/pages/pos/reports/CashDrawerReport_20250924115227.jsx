// src/pages/reports/CashDrawerReport.jsx
import React from "react";

function CashDrawerReport() {
  const drawerData = [
    {
      id: 1,
      date: "2025-09-21",
      opening: 50000,
      cashIn: 200000,
      cashOut: 150000,
      closing: 100000,
    },
    {
      id: 2,
      date: "2025-09-22",
      opening: 100000,
      cashIn: 250000,
      cashOut: 180000,
      closing: 170000,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-xl font-semibold text-blue-400">Cash Drawer Report</h2>
      <p className="text-gray-400">Monitor your daily cash drawer activity including opening, in, out, and closing balances.</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-sm">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Opening (₦)</th>
              <th className="px-4 py-2 text-right">Cash In (₦)</th>
              <th className="px-4 py-2 text-right">Cash Out (₦)</th>
              <th className="px-4 py-2 text-right">Closing (₦)</th>
            </tr>
          </thead>
          <tbody>
            {drawerData.map((row) => (
              <tr key={row.id} className="border-b border-gray-700 text-gray-200">
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2 text-right">₦{row.opening.toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-green-400">₦{row.cashIn.toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-red-400">₦{row.cashOut.toLocaleString()}</td>
                <td className="px-4 py-2 text-right font-semibold">₦{row.closing.toLocaleString()}</td>
              </tr>
            ))}
            {drawerData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No cash drawer records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CashDrawerReport;
