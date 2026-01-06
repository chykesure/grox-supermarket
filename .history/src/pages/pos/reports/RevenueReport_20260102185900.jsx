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
  // Fetch ALL revenue and returns once
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [revRes, retRes] = await Promise.all([
          axios.get("http://localhost:8080/api/revenue"),
          axios.get("http://localhost:8080/api/returns"),
        ]);

        setRevenueData(revRes.data || []);        // Today, This Week, This Month
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
  // Frontend date filtering (same as ReturnItemsHistory)
  // -----------------------------
  const getPeriodRange = (period) => {
    const now = new Date();
    let start, end;
    switch (period) {
      case "Today":
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "This Week":
        const day = now.getDay() || 7;
        start = new Date(now);
        start.setDate(now.getDate() - day + 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case "This Month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      default:
        start = new Date(0);
        end = new Date();
    }
    return { start, end };
  };

  const filteredRevenueData = revenueData.map((row) => {
    const { start, end } = getPeriodRange(row.period);

    // Filter returns for this period + custom date range
    const periodReturns = returnData.filter((r) => {
      const rDate = new Date(r.date);
      let match = rDate >= start && rDate <= end;

      if (startDate && endDate) {
        const customStart = new Date(startDate);
        const customEnd = new Date(endDate);
        customEnd.setHours(23, 59, 59, 999);
        match = rDate >= customStart && rDate <= customEnd;
      } else if (startDate) {
        match = rDate >= new Date(startDate);
      } else if (endDate) {
        const customEnd = new Date(endDate);
        customEnd.setHours(23, 59, 59, 999);
        match = rDate <= customEnd;
      }

      return match;
    });

    const totalRefundForPeriod = periodReturns.reduce(
      (sum, r) => sum + (r.totalRefund || 0),
      0
    );

    return {
      ...row,
      returns: totalRefundForPeriod,
      netSales: row.sales - totalRefundForPeriod,
      netProfit: row.profit - totalRefundForPeriod,
    };
  });

  // -----------------------------
  // Totals (from filtered data)
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
  // Export functions (use filtered data)
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Revenue Report", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [["Period", "Sales (₦)", "Cost (₦)", "Profit (₦)", "Returns (₦)", "Net Sales (₦)", "Net Profit (₦)"]],
      body: filteredRevenueData.map((row) => [
        row.period,
        row.sales.toLocaleString(),
        row.cost.toLocaleString(),
        row.profit.toLocaleString(),
        row.returns.toLocaleString(),
        row.netSales.toLocaleString(),
        row.netProfit.toLocaleString(),
      ]),
    });
    doc.text(
      `Totals → Sales: ₦${totals.sales.toLocaleString()} | Returns: ₦${totals.returns.toLocaleString()} | Net Sales: ₦${totals.netSales.toLocaleString()}`,
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
      {/* Header */}
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
        <div className="bg-gray-800 p-4 rounded-2xl shadow"><p className="text-gray-400 text-sm">Total Sales</p><p className="text-xl font-semibold text-gray-200">₦{totals.sales.toLocaleString()}</p></div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow"><p className="text-gray-400 text-sm">Total Cost</p><p className="text-xl font-semibold text-red-400">₦{totals.cost.toLocaleString()}</p></div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow"><p className="text-gray-400 text-sm">Total Profit</p><p className="text-xl font-semibold text-green-400">₦{totals.profit.toLocaleString()}</p></div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow"><p className="text-gray-400 text-sm">Total Returns</p><p className="text-xl font-semibold text-yellow-400">₦{totals.returns.toLocaleString()}</p></div>
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
                <td className="px-4 py-3 text-right text-gray-300">₦{row.sales.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-red-400">₦{row.cost.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-green-400">₦{row.profit.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-yellow-400">₦{row.returns.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-200">₦{row.netSales.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-200">₦{row.netProfit.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RevenueReport;