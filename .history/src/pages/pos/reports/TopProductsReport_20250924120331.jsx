// src/pages/reports/TopProductsReport.jsx
import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function TopProductsReport() {
  const topProducts = [
    { id: 1, product: "Coca-Cola 50cl", category: "Beverages", qtySold: 120, revenue: 60000 },
    { id: 2, product: "Bread (Large)", category: "Bakery", qtySold: 85, revenue: 42500 },
    { id: 3, product: "Indomie Noodles (40pcs)", category: "Food", qtySold: 50, revenue: 75000 },
    { id: 4, product: "Maltina Can", category: "Beverages", qtySold: 60, revenue: 48000 },
  ];

  // 📊 Totals
  const totalQty = topProducts.reduce((sum, item) => sum + item.qtySold, 0);
  const totalRevenue = topProducts.reduce((sum, item) => sum + item.revenue, 0);

  // 🏆 Best seller (highest revenue)
  const bestSeller = topProducts.reduce(
    (max, item) => (item.revenue > max.revenue ? item : max),
    topProducts[0]
  );

  // 📥 Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(topProducts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Top Products");
    XLSX.writeFile(wb, "TopProductsReport.xlsx");
  };

  // 📥 Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Top Products Report", 14, 15);
    doc.autoTable({
      head: [["Product", "Category", "Quantity Sold", "Revenue (₦)"]],
      body: topProducts.map((item) => [
        item.product,
        item.category,
        item.qtySold,
        `₦${item.revenue.toLocaleString()}`,
      ]),
      foot: [["", "TOTAL", totalQty, `₦${totalRevenue.toLocaleString()}`]],
      startY: 20,
    });
    doc.save("TopProductsReport.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-400">Top Products Report</h2>
        <p className="text-gray-400">See your best-selling products by quantity and revenue.</p>
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
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Quantity Sold</th>
              <th className="px-4 py-3 text-right">Revenue (₦)</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-gray-700 text-gray-200 hover:bg-gray-800 transition ${
                  item.id === bestSeller.id ? "bg-blue-900/40" : ""
                }`}
              >
                <td className="px-4 py-2 flex items-center gap-2">
                  {item.product}
                  {item.id === bestSeller.id && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded">
                      🏆 Best Seller
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2 text-right">{item.qtySold}</td>
                <td className="px-4 py-2 text-right">₦{item.revenue.toLocaleString()}</td>
              </tr>
            ))}
            {topProducts.length > 0 && (
              <tr className="bg-gray-900 font-semibold text-gray-300">
                <td className="px-4 py-3 text-right" colSpan="2">
                  TOTAL
                </td>
                <td className="px-4 py-3 text-right">{totalQty}</td>
                <td className="px-4 py-3 text-right">₦{totalRevenue.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProductsReport;
