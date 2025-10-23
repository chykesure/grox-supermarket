import React, { useState } from "react";

function History() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Demo transaction history (replace with backend fetch later)
  const [transactions] = useState([
    {
      id: 1,
      date: "2025-09-20",
      type: "purchase",
      details: "2x Bread, 1x Milk",
      amount: "₦2,500",
    },
    {
      id: 2,
      date: "2025-09-21",
      type: "loyalty",
      details: "Points Redeemed",
      amount: "-200 pts",
    },
    {
      id: 3,
      date: "2025-09-22",
      type: "purchase",
      details: "3x Eggs, 2x Butter",
      amount: "₦3,800",
    },
    {
      id: 4,
      date: "2025-09-23",
      type: "loyalty",
      details: "Bonus Points Added",
      amount: "+100 pts",
    },
  ]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.details.toLowerCase().includes(search.toLowerCase()) ||
      t.date.includes(search);
    const matchesFilter = filter === "all" || t.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getBadgeStyle = (type) => {
    switch (type) {
      case "purchase":
        return "bg-blue-600";
      case "loyalty":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="p-6 text-gray-200 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Customer History</h2>
        <p className="text-gray-400">
          View customer purchase history, loyalty redemptions, and activity logs.
        </p>
      </div>

      {/* Search + Filter controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by details or date..."
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="purchase">Purchases</option>
          <option value="loyalty">Loyalty</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600 text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-300">
                Date
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-300">
                Type
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-300">
                Details
              </th>
              <th className="px-4 py-2 text-right font-semibold text-gray-300">
                Amount / Points
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-400 italic"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-400">{t.date}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs text-white ${getBadgeStyle(
                        t.type
                      )}`}
                    >
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-300">{t.details}</td>
                  <td className="px-4 py-2 text-right text-gray-300">
                    {t.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
