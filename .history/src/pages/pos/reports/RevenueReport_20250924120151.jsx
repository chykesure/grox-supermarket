// src/pages/reports/RevenueReport.jsx
import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function RevenueReport() {
  const revenueData = [
    { id: 1, period: "Today", sales: 120000, refunds: 5000, net: 115000 },
    { id: 2, period: "This Week", sales: 850000, refunds: 20000, net: 830000 },
    { id: 3, period: "This Month", sales: 3200000, refunds: 60000, net: 3140000 },
  ];

  // ✅ Totals for summary
  const totals = revenueData.reduce(
    (acc, row) => {
      acc.sales += row.sales;
      acc.refunds += row.refunds;
      acc.net += row.net;
      return acc;
    },
    { sales: 0, refunds: 0, net: 0 }
  );

  // ✅ Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      revenueData.map((row) => ({
        Period: row.period,
        "Total Sales (₦)": row.sales,
        "Refunds (₦)": row.refunds,
        "Net Revenue (₦)": row.net,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Report");
    XLSX.writeFile(workbook, "revenue_report.xlsx");
  };

  // ✅ Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Revenue Report", 14, 15);

    doc.autoTable({
      startY: 20,
      head: [["Period", "Total Sales (₦)", "Refunds (₦)", "Net Revenue (₦)"]],
      body: revenueData.map((row) => [
        row.period,
        row.sales.toLocaleString(),
        row.refunds.toLocaleString(),
        row.net.toLocaleString(),
      ]),
    });

    // Totals summary
    doc.text(
      `Totals → Sales: ₦${totals.sales.toLocaleString()} | Refunds: ₦${totals.refunds.toLocaleString()} | Net: ₦${totals.net.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("revenue_report.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-blue-500">💰 Revenue Report</h2>
          <p className="text-gray-400 text-sm">
            Track your sales, refunds, and net revenue performance across different time periods.
          </p>
        </div>
        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Sales</p>
          <p className="text-xl font-semibold text-gray-200">
            ₦{totals.sales.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Refunds</p>
          <p className="text-xl font-semibold text-red-400">
            ₦{totals.refunds.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Net Revenue</p>
          <p className="text-xl font-semibold text-green-400">
            ₦{totals.net.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-sm">
              <th className="px-4 py-3 text-left">Period</th>
              <th className="px-4 py-3 text-right">Total Sales (₦)</th>
              <th className="px-4 py-3 text-right">Refunds (₦)</th>
              <th className="px-4 py-3 text-right">Net Revenue (₦)</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-700 hover:bg-gray-800/60 transition"
              >
                <td className="px-4 py-3 text-gray-200">{row.period}</td>
                <td className="px-4 py-3 text-right text-gray-300">
                  ₦{row.sales.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-red-400">
                  ₦{row.refunds.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-400">
                  ₦{row.net.toLocaleString()}
                </td>
              </tr>
            ))}
            {revenueData.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
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
