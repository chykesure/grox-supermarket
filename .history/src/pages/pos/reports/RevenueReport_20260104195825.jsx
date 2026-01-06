import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function RevenueReport() {
  const [revenueData, setRevenueData] = useState([]);
  const [returnData, setReturnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // -----------------------------
  // Fetch revenue and returns data
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [revRes, retRes] = await Promise.all([
          axios.get("http://localhost:8080/api/revenue"),
          axios.get("http://localhost:8080/api/returns"),
        ]);

        setRevenueData(revRes.data || []);
        setReturnData(retRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRevenueData([]);
        setReturnData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // -----------------------------
  // Helper: format currency
  // -----------------------------
  const formatCurrency = (amount) =>
    "₦" + (amount || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // -----------------------------
  // Filter revenue & returns by date
  // -----------------------------
  const filteredRevenueData = revenueData
    .map((row) => {
      const rowDate = new Date(row.date);

      // Apply date filter to revenue row
      if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);
        if (rowDate < start || rowDate > end) return null;
      }

      // Filter returns for this period within same date range
      const periodReturns = returnData.filter((r) => {
        const rDate = new Date(r.date);
        if (startDate || endDate) {
          const start = startDate ? new Date(startDate) : new Date(0);
          const end = endDate ? new Date(endDate) : new Date();
          end.setHours(23, 59, 59, 999);
          return rDate >= start && rDate <= end;
        }
        return true;
      });

      const totalReturns = periodReturns.reduce((sum, r) => sum + (r.totalRefund || 0), 0);

      return {
        ...row,
        returns: totalReturns,
        netSales: row.sales - totalReturns,
        netProfit: row.profit - totalReturns,
      };
    })
    .filter(Boolean); // remove nulls

  // -----------------------------
  // Totals for summary cards
  // -----------------------------
  const totals = filteredRevenueData.reduce(
    (acc, row) => {
      acc.sales += row.sales;
      acc.cost += row.cost;
      acc.profit += row.profit;
      acc.returns += row.returns;
      acc.netSales += row.netSales;
      acc.netProfit += row.netProfit;
      return acc;
    },
    { sales: 0, cost: 0, profit: 0, returns: 0, netSales: 0, netProfit: 0 }
  );

  // -----------------------------
  // Export to Excel
  // -----------------------------
  const exportToExcel = () => {
    const data = filteredRevenueData.map((row) => ({
      Period: row.period,
      "Sales (₦)": row.sales,
      "Cost (₦)": row.cost,
      "Profit (₦)": row.profit,
      "Returns (₦)": row.returns,
      "Net Sales (₦)": row.netSales,
      "Net Profit (₦)": row.netProfit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Report");
    XLSX.writeFile(workbook, "revenue_report.xlsx");
  };

  // -----------------------------
  // Export to PDF
  // -----------------------------
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Revenue Report", 14, 15);

    doc.autoTable({
      startY: 20,
      head: [["Period", "Sales (₦)", "Cost (₦)", "Profit (₦)", "Returns (₦)", "Net Sales (₦)", "Net Profit (₦)"]],
      body: filteredRevenueData.map((row) => [
        row.period,
        formatCurrency(row.sales),
        formatCurrency(row.cost),
        formatCurrency(row.profit),
        formatCurrency(row.returns),
        formatCurrency(row.netSales),
        formatCurrency(row.netProfit),
      ]),
    });

    doc.text(
      `Totals → Sales: ${formatCurrency(totals.sales)} | Returns: ${formatCurrency(totals.returns)} | Net Sales: ${formatCurrency(totals.netSales)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("revenue_report.pdf");
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (loading) return <div className="py-12 text-center text-gray-400">Loading revenue...</div>;
  if (revenueData.length === 0) return <div className="py-12 text-center text-gray-500">No revenue data</div>;

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-blue-500">💰 Revenue Report</h2>
          <p className="text-gray-400 text-sm">Track sales, cost, profit & returns. Filter by date range.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 rounded-lg text-gray-700" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 rounded-lg text-gray-700" />
          <button onClick={() => { setStartDate(""); setEndDate(""); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm">
            Reset
          </button>
          <button onClick={exportToExcel} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow">
            Export Excel
          </button>
          <button onClick={exportToPDF} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow">
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Sales</p>
          <p className="text-xl font-semibold text-gray-200">{formatCurrency(totals.sales)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Cost</p>
          <p className="text-xl font-semibold text-red-400">{formatCurrency(totals.cost)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Profit</p>
          <p className="text-xl font-semibold text-green-400">{formatCurrency(totals.profit)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Returns</p>
          <p className="text-xl font-semibold text-yellow-400">{formatCurrency(totals.returns)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-sm">
              <th className="px-4 py-3 text-left">Period</th>
              <th className="px-4 py-3 text-right">Sales (₦)</th>
              <th className="px-4 py-3 text-right">Cost (₦)</th>
              <th className="px-4 py-3 text-right">Profit (₦)</th>
              <th className="px-4 py-3 text-right">Returns (₦)</th>
              <th className="px-4 py-3 text-right">Net Sales (₦)</th>
              <th className="px-4 py-3 text-right">Net Profit (₦)</th>
            </tr>
          </thead>
          <tbody>
            {filteredRevenueData.map((row, i) => (
              <tr key={i} className="border-b border-gray-700 hover:bg-gray-800/60">
                <td className="px-4 py-3 text-gray-200">{row.period}</td>
                <td className="px-4 py-3 text-right text-gray-300">{formatCurrency(row.sales)}</td>
                <td className="px-4 py-3 text-right text-red-400">{formatCurrency(row.cost)}</td>
                <td className="px-4 py-3 text-right text-green-400">{formatCurrency(row.profit)}</td>
                <td className="px-4 py-3 text-right text-yellow-400">{formatCurrency(row.returns)}</td>
                <td className="px-4 py-3 text-right text-gray-200">{formatCurrency(row.netSales)}</td>
                <td className="px-4 py-3 text-right text-gray-200">{formatCurrency(row.netProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RevenueReport;
