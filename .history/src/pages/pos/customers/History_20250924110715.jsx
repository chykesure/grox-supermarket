import React from "react";

function History() {
  return (
    <div className="p-6 text-gray-200">
      <h2 className="text-2xl font-bold mb-4">Customer History</h2>
      <p className="text-gray-400 mb-6">
        View customer purchase history, loyalty redemptions, and activity logs.
      </p>

      {/* Example table layout */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-xl shadow-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Details</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-300">Amount / Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {/* Placeholder rows */}
            <tr>
              <td className="px-4 py-2 text-gray-400">2025-09-20</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 rounded bg-blue-600 text-xs">Purchase</span>
              </td>
              <td className="px-4 py-2 text-gray-300">2x Bread, 1x Milk</td>
              <td className="px-4 py-2 text-right text-gray-300">₦2,500</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-400">2025-09-21</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 rounded bg-green-600 text-xs">Loyalty</span>
              </td>
              <td className="px-4 py-2 text-gray-300">Points Redeemed</td>
              <td className="px-4 py-2 text-right text-gray-300">-200 pts</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
