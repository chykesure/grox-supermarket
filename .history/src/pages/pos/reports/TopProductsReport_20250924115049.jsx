// src/pages/reports/TopProductsReport.jsx
import React from "react";

function TopProductsReport() {
  const topProducts = [
    { id: 1, product: "Coca-Cola 50cl", category: "Beverages", qtySold: 120, revenue: 60000 },
    { id: 2, product: "Bread (Large)", category: "Bakery", qtySold: 85, revenue: 42500 },
    { id: 3, product: "Indomie Noodles (40pcs)", category: "Food", qtySold: 50, revenue: 75000 },
    { id: 4, product: "Maltina Can", category: "Beverages", qtySold: 60, revenue: 48000 },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-xl font-semibold text-blue-400">Top Products Report</h2>
      <p className="text-gray-400">See your best-selling products by quantity and revenue.</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-sm">
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-right">Quantity Sold</th>
              <th className="px-4 py-2 text-right">Revenue (₦)</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 text-gray-200">
                <td className="px-4 py-2">{item.product}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2 text-right">{item.qtySold}</td>
                <td className="px-4 py-2 text-right">₦{item.revenue.toLocaleString()}</td>
              </tr>
            ))}
            {topProducts.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No product data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProductsReport;
