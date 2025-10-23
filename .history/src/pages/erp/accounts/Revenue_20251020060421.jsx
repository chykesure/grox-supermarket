import React from "react";
import { TrendingUp, DollarSign, PieChart, BarChart2 } from "lucide-react";

function Revenue() {
  return (
    <div className="overflow-y-scroll scrollbar-hide h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-400">Revenue Analytics</h2>
        <p className="text-gray-400">
          A detailed breakdown of income sources, trends, and growth rates across your business units.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            title: "Total Revenue (YTD)",
            value: "₦12,540,000",
            icon: <TrendingUp className="text-green-400 w-5 h-5" />,
            change: "+18.5%",
            desc: "compared to last year",
          },
          {
            title: "Monthly Growth",
            value: "₦1,050,000",
            icon: <BarChart2 className="text-blue-400 w-5 h-5" />,
            change: "+4.2%",
            desc: "this month vs previous",
          },
          {
            title: "Top Product Revenue",
            value: "₦3,200,000",
            icon: <DollarSign className="text-yellow-400 w-5 h-5" />,
            change: "+7.1%",
            desc: "from Product Alpha",
          },
          {
            title: "Net Profit Margin",
            value: "57.4%",
            icon: <PieChart className="text-purple-400 w-5 h-5" />,
            change: "+2.9%",
            desc: "profitability ratio",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gray-900 p-5 rounded-xl border border-gray-700 shadow-md hover:border-blue-500/40 transition-all"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-gray-400 text-sm">{item.title}</h3>
              {item.icon}
            </div>
            <p className="text-2xl font-bold text-gray-100 mt-2">{item.value}</p>
            <span className="text-green-400 text-sm mt-1 inline-block">
              {item.change}
            </span>
            <p className="text-gray-500 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Revenue by Channel */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 mb-8 shadow-lg">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">Revenue by Channel</h3>
        <p className="text-gray-400 text-sm mb-4">
          Distribution of income across different sales channels and services.
        </p>
        <div className="h-64 flex items-center justify-center text-gray-500 italic border border-gray-700 rounded-lg">
          [Insert Chart.js or Recharts — Bar/Line Chart Placeholder]
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">Monthly Revenue Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Month</th>
                <th className="px-4 py-3 text-left">Revenue</th>
                <th className="px-4 py-3 text-left">Growth Rate</th>
                <th className="px-4 py-3 text-left">Top Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {[
                ["January", "₦850,000", "+4.2%", "Product Alpha"],
                ["February", "₦920,000", "+3.9%", "Retail"],
                ["March", "₦1,050,000", "+5.4%", "Subscription"],
                ["April", "₦980,000", "+2.3%", "Wholesale"],
                ["May", "₦1,100,000", "+4.8%", "Online Sales"],
                ["June", "₦1,200,000", "+6.1%", "Product Beta"],
              ].map(([month, revenue, growth, source], i) => (
                <tr key={i} className="hover:bg-gray-800 transition">
                  <td className="px-4 py-3">{month}</td>
                  <td className="px-4 py-3">{revenue}</td>
                  <td className="px-4 py-3 text-green-400">{growth}</td>
                  <td className="px-4 py-3">{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
