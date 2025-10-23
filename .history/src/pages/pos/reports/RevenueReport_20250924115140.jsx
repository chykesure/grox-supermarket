// src/pages/reports/RevenueReport.jsx
import React from "react";

function RevenueReport() {
  const revenueData = [
    { id: 1, period: "Today", sales: 120000, refunds: 5000, net: 115000 },
    { id: 2, period: "This Week", sales: 850000, refunds: 20000, net: 830000 },
    { id: 3, period: "This Month", sales: 3200000, refunds: 60000, net: 3140000 },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-xl font-semibold text-blue-400">Revenue Report</h2>
      <p className="text-gray-400">Track your revenue, refunds, and net income over different time periods.</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-sm">
              <th className="px-4 py-2 text-left">Period</th>
              <th className="px-4 py-2 text-right">Total Sales (₦)</th>
              <th className="px-4 py-2 text-right">Refunds (₦)</th>
              <th className="px-4 py-2 text-right">Net Revenue (₦)</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((row) => (
              <tr key={row.id} className="border-b border-gray-700 text-gray-200">
                <td className="px-4 py-2">{row.period}</td>
                <td className="px-4 py-2 text-right">₦{row.sales.toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-red-400">₦{row.refunds.toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-green-400 font-semibold">
                  ₦{row.net.toLocaleString()}
                </td>
              </tr>
            ))}
            {revenueData.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No revenue data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RevenueReport;
