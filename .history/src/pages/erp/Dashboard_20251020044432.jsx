import React, { useState, useEffect } from "react";
import Sidebar from "../../partials/";
import Header from "../../partials/Header";
import FilterButton from "../../components/DropdownFilter";
import Datepicker from "../../components/Datepicker";
import Banner from "../../partials/Banner";
//import axios from "axios";

function ErpDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("/api/erp/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching ERP summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const formatCurrency = (num) =>
    num?.toLocaleString("en-NG", { style: "currency", currency: "NGN" });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-[#0e0f11]">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-6 py-8 w-full max-w-9xl mx-auto">
            {/* Header Actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-100">
                  ERP Dashboard
                </h1>
                <p className="text-gray-400">
                  Company-wide performance overview
                </p>
              </div>
              <div className="grid grid-flow-col sm:auto-cols-max gap-2">
                <FilterButton align="right" />
                <Datepicker align="right" />
              </div>
            </div>

            {loading ? (
              <p className="text-gray-400 text-center mt-20">Loading dashboard...</p>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    { title: "Total Revenue", value: formatCurrency(summary?.revenue), color: "from-green-600 to-emerald-700" },
                    { title: "Total Expenses", value: formatCurrency(summary?.expenses), color: "from-red-600 to-rose-700" },
                    { title: "Net Profit", value: formatCurrency(summary?.profit), color: "from-blue-600 to-indigo-700" },
                    { title: "Employees", value: summary?.employees, color: "from-purple-600 to-fuchsia-700" },
                    { title: "Purchase Orders", value: summary?.purchaseOrders, color: "from-yellow-500 to-amber-600" },
                    { title: "Total Assets", value: formatCurrency(summary?.assetsValue), color: "from-gray-600 to-slate-700" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-6 bg-gradient-to-br ${item.color} rounded-2xl text-white shadow-lg transition-transform hover:scale-[1.02]`}
                    >
                      <h2 className="text-sm uppercase tracking-wide text-gray-200">
                        {item.title}
                      </h2>
                      <p className="text-2xl font-bold mt-2">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-72 flex items-center justify-center text-gray-400">
                    📊 Financial Trend Chart
                  </div>
                  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-72 flex items-center justify-center text-gray-400">
                    📈 HR & Assets Trend Chart
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Recent Activities
                  </h2>
                  <table className="w-full text-gray-300">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="py-2">Date</th>
                        <th className="py-2">Module</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Amount / Value</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary?.activities?.map((act, idx) => (
                        <tr key={idx} className="border-b border-gray-800">
                          <td className="py-2">{act.date}</td>
                          <td className="py-2">{act.module}</td>
                          <td className="py-2">{act.description}</td>
                          <td className="py-2">{formatCurrency(act.amount)}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded-md text-sm ${
                                act.status === "Completed"
                                  ? "bg-green-600 text-white"
                                  : "bg-yellow-600 text-white"
                              }`}
                            >
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
}

export default ErpDashboard;
