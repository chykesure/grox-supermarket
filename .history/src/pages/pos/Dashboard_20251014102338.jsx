import React, { useState } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import FilterButton from "../../components/DropdownFilter";
import Datepicker from "../../components/Datepicker";
import Banner from "../../partials/Banner";

function Dashboard() {
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
              {/* Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard Overview
                </h1>
                <p className="text-gray-400 mt-1">
                  Quick summary of store performance
                </p>
              </div>

              {/* Right-side actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <FilterButton align="right" />
                <Datepicker align="right" />
              </div>
            </div>

            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { title: "Total Sales", value: "₦1,245,000", color: "bg-green-600" },
                { title: "Total Orders", value: "320", color: "bg-blue-600" },
                { title: "Pending Orders", value: "28", color: "bg-yellow-500" },
                { title: "Out of Stock", value: "12", color: "bg-red-600" },
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
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 h-64 flex items-center justify-center text-gray-400">
                📊 Sales Overview Chart Placeholder
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 h-64 flex items-center justify-center text-gray-400">
                📈 Revenue Growth Chart Placeholder
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Recent Transactions
              </h2>
              <table className="w-full text-gray-300">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="py-2">Date</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Items</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-2">2025-10-14</td>
                    <td className="py-2">John Doe</td>
                    <td className="py-2">5</td>
                    <td className="py-2">₦45,000</td>
                    <td className="py-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded-md text-sm">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2">2025-10-14</td>
                    <td className="py-2">Mary Smith</td>
                    <td className="py-2">2</td>
                    <td className="py-2">₦12,500</td>
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

export default Dashboard;
