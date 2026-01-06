// src/pages/reports/RevenueReport.jsx
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
  // Fetch revenue and returns
  // -----------------------------
  const fetchRevenue = async () => {
    setLoading(true);
    try {
      let revenueUrl = "http://localhost:8080/api/revenue";
      let returnsUrl = "http://localhost:8080/api/returns";

      if (startDate && endDate) {
        revenueUrl += `?startDate=${startDate}&endDate=${endDate}`;
        returnsUrl += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const [revRes, retRes] = await Promise.all([
        axios.get(revenueUrl),
        axios.get(returnsUrl),
      ]);

      setRevenueData(revRes.data || []);
      setReturnData(retRes.data.data || []); // returns endpoint returns { data: [...] }
    } catch (error) {
      console.error("Error fetching revenue or returns:", error);
      setRevenueData([]);
      setReturnData([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Initial fetch
  // -----------------------------
  useEffect(() => {
    fetchRevenue();
  }, []);

  // -----------------------------
  // Helper: Get period range
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
        const day = now.getDay() || 7; // Sunday = 7
        start = new Date(now);
        start.setDate(now.getDate() - day + 1); // Monday start
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

  // -----------------------------
  // Compute totals with returns
  // -----------------------------
  const totals = revenueData.reduce(
    (acc, row) => {
      const { start, end } = getPeriodRange(row.period);

      const periodReturns = returnData.filter((r) => {
        const rDate = new Date(r.date);
        return rDate >= start && rDate <= end;
      });

      const totalRefundForPeriod = periodReturns.reduce(
        (sum, r) => sum + (r.totalRefund || 0),
        0
      );

      acc.sales += row.sales;
      acc.cost += row.cost;
      acc.profit += row.profit;
      acc.returns += totalRefundForPeriod;
      acc.netSales += row.sales - totalRefundForPeriod;
      acc.netProfit += row.profit - totalRefundForPeriod;

      return acc;
    },
    { sales: 0, cost: 0, profit: 0, returns: 0, netSales: 0, netProfit: 0 }
  );

  // -----------------------------
  // Export Excel
  // -----------------------------
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      revenueData.map((row) => {
        const { start, end } = getPeriodRange(row.period);

        const periodReturns = returnData.filter((r) => {
          const rDate = new Date(r.date);
          return rDate >= start && rDate <= end;
        });

        const totalRefundForPeriod = periodReturns.reduce(
          (sum, r) => sum + (r.totalRefund || 0),
          0
        );

        return {
          Period: row.period,
          "Sales (₦)": row.sales,
          "Cost (₦)": row.cost,
          "Profit (₦)": row.profit,
          "Returns (₦)": totalRefundForPeriod,
          "Net Sales (₦)": row.sales - totalRefundForPeriod,
          "Net Profit (₦)": row.profit - totalRefundForPeriod,
        };
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Report");
    XLSX.writeFile(workbook, "revenue_report.xlsx");
  };

  // -----------------------------
  // Export PDF
  // -----------------------------
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Revenue Report", 14, 15);

    doc.autoTable({
      startY: 20,
      head: [
        ["Period", "Sales (₦)", "Cost (₦)", "Profit (₦)", "Returns (₦)", "Net Sales (₦)", "Net Profit (₦)"]
      ],
      body: revenueData.map((row) => {
        const { start, end } = getPeriodRange(row.period);
        const periodReturns = returnData.filter((r) => {
          const rDate = new Date(r.date);
          return rDate >= start && rDate <= end;
        });
        const totalRefundForPeriod = periodReturns.reduce(
          (sum, r) => sum + (r.totalRefund || 0),
          0
        );

        return [
          row.period,
          row.sales.toLocaleString(),
          row.cost.toLocaleString(),
          row.profit.toLocaleString(),
          totalRefundForPeriod.toLocaleString(),
          (row.sales - totalRefundForPeriod).toLocaleString(),
          (row.profit - totalRefundForPeriod).toLocaleString()
        ];
      })
    });

    doc.text(
      `Totals → Sales: ₦${totals.sales.toLocaleString()} | Cost: ₦${totals.cost.toLocaleString()} | Profit: ₦${totals.profit.toLocaleString()} | Returns: ₦${totals.returns.toLocaleString()} | Net Sales: ₦${totals.netSales.toLocaleString()} | Net Profit: ₦${totals.netProfit.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("revenue_report.pdf");
  };

  // -----------------------------
  // UI RENDER
  // -----------------------------
  if (loading)
    return <div className="py-12 text-center text-gray-400">Loading revenue...</div>;
  if (revenueData.length === 0)
    return <div className="py-12 text-center text-gray-500">No revenue records found</div>;

  return (
    <div className="space-y-6">
      {/* HEADER + Date Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-blue-500">💰 Revenue Report</h2>
          <p className="text-gray-400 text-sm">
            Track sales, cost, profit & returns. Filter by date range.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-lg text-gray-700"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-lg text-gray-700"
          />
          <button
            onClick={fetchRevenue}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow"
          >
            Fetch
          </button>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Sales</p>
          <p className="text-xl font-semibold text-gray-200">₦{totals.sales.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Cost</p>
          <p className="text-xl font-semibold text-red-400">₦{totals.cost.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Profit</p>
          <p className="text-xl font-semibold text-green-400">₦{totals.profit.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-gray-400 text-sm">Total Returns</p>
          <p className="text-xl font-semibold text-yellow-400">₦{totals.returns.toLocaleString()}</p>
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
            {revenueData.map((row, index) => {
              const { start, end } = getPeriodRange(row.period);
              const periodReturns = returnData.filter((r) => {
                const rDate = new Date(r.date);
                return rDate >= start && rDate <= end;
              });
              const totalRefundForPeriod = periodReturns.reduce((sum, r) => sum + (r.totalRefund || 0), 0);

              return (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/60 transition">
                  <td className="px-4 py-3 text-gray-200">{row.period}</td>
                  <td className="px-4 py-3 text-right text-gray-300">₦{row.sales.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-red-400">{row.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-400">₦{row.profit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-yellow-400">₦{totalRefundForPeriod.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-200">₦{(row.sales - totalRefundForPeriod).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-200">₦{(row.profit - totalRefundForPeriod).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RevenueReport;
