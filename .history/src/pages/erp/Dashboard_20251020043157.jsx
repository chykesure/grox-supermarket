import React, { useState } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import FilterButton from "../../components/DropdownFilter";
import Datepicker from "../../components/Datepicker";
import Banner from "../../partials/Banner";

function ErpDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content Area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main */}
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard Actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-100 font-bold">
                  ERP Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                  Company-wide overview: Financial, HR, Inventory & Assets
                </p>
              </div>

              {/* Filters */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <FilterButton align="right" />
                <Datepicker align="right" />
              </div>
            </div>

            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Financial Metrics */}
              {[
                { title: "Total Revenue", value: "₦12,500,000", color: "bg-green-700" },
                { title: "Total Expenses", value: "₦4,350,000", color: "bg-red-700" },
                { title: "Net Profit", value: "₦8,150,000", color: "bg-blue-700" },
                { title: "Outstanding Payables", value: "₦1,200,000", color: "bg-yellow-600" },
                { title: "Total Employees", value: "84", color: "bg-purple-700" },
                { title: "Active Payroll", value: "₦2,800,000", color: "bg-indigo-700" },
                { title: "Leave Requests", value: "6 Pending", color: "bg-orange-600" },
                { title: "Purchase Orders", value: "42 Active", color: "bg-cyan-700" },
                { title: "Stock Value", value: "₦6,500,000", color: "bg-emerald-700" },
                { title: "Total Assets", value: "₦18,000,000", color: "bg-slate-700" },
                { title: "Maintenance Alerts", value: "3 Urgent", color: "bg-pink-700" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl ${item.color} text-white shadow-lg`}
                >
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-2xl font-bold mt-2">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 h-72 flex items-center justify-center text-gray-400">
                📊 Financial Trend Chart Placeholder
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 h-72 flex items-center justify-center text-gray-400">
                📈 HR & Assets Trend Chart Placeholder
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
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
                  <tr className="border-b border-gray-800">
                    <td className="py-2">2025-10-18</td>
                    <td className="py-2">Finance</td>
                    <td className="py-2">Invoice #INV-234 paid</td>
                    <td className="py-2">₦85,000</td>
                    <td className="py-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded-md text-sm">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2">2025-10-18</td>
                    <td className="py-2">HR</td>
                    <td className="py-2">October Payroll processed</td>
                    <td className="py-2">₦2,800,000</td>
                    <td className="py-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded-md text-sm">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2">2025-10-17</td>
                    <td className="py-2">Assets</td>
                    <td className="py-2">AC Unit maintenance scheduled</td>
                    <td className="py-2">₦50,000</td>
                    <td className="py-2">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-sm">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
}

export default ErpDashboard;
