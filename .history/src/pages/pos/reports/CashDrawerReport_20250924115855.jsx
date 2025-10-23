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

  // ✅ Totals for summary
  const totals = drawerData.reduce(
    (acc, row) => {
      acc.opening += row.opening;
      acc.cashIn += row.cashIn;
      acc.cashOut += row.cashOut;
      acc.closing += row.closing;
      return acc;
    },
    { opening: 0, cashIn: 0, cashOut: 0, closing: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-500">📊 Cash Drawer Report</h2>
        <p className="text-gray-400 text-sm">
          Monitor daily cash drawer activity including opening balance, inflows, outflows, and closing balance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Opening</p>
          <p className="text-lg font-semibold text-gray-200">₦{totals.opening.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Cash In</p>
          <p className="text-lg font-semibold text-green-400">₦{totals.cashIn.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Cash Out</p>
          <p className="text-lg font-semibold text-red-400">₦{totals.cashOut.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Closing</p>
          <p
            className={`text-lg font-semibold ${
              totals.closing >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ₦{totals.closing.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-sm">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Opening (₦)</th>
              <th className="px-4 py-3 text-right">Cash In (₦)</th>
              <th className="px-4 py-3 text-right">Cash Out (₦)</th>
              <th className="px-4 py-3 text-right">Closing (₦)</th>
            </tr>
          </thead>
          <tbody>
            {drawerData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-700 hover:bg-gray-800/60 transition"
              >
                <td className="px-4 py-3 text-gray-200">{row.date}</td>
                <td className="px-4 py-3 text-right text-gray-300">
                  ₦{row.opening.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-green-400">
                  ₦{row.cashIn.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-red-400">
                  ₦{row.cashOut.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    row.closing >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ₦{row.closing.toLocaleString()}
                </td>
              </tr>
            ))}
            {drawerData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
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
