// src/pages/reports/ReportMgt.jsx
import React, { useState } from "react";
import { BarChart, CreditCard } from "lucide-react";
import SalesReport from "./SalesReport";
import TopProductsReport from "./TopProductsReport";
import RevenueReport from "./RevenueReport";
import CashDrawerReport from "./CashDrawerReport";

function ReportMgt() {
  const [activeTab, setActiveTab] = useState("sales");

  const tabs = [
    { key: "sales", title: "Sales", icon: <BarChart className="w-4 h-4" /> },
    { key: "top-products", title: "Top Products", icon: <BarChart className="w-4 h-4" /> },
    { key: "revenue", title: "Revenue", icon: <BarChart className="w-4 h-4" /> },
    { key: "cash-drawer", title: "Cash Drawer", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-400">Reports</h1>
      <p className="text-gray-400">Access and manage reports below.</p>

      {/* Tab Control */}
      <div className="flex gap-2 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-gray-800 text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.icon}
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        {activeTab === "sales" && <SalesReport />}
        {activeTab === "top-products" && <TopProductsReport />}
        {activeTab === "revenue" && <RevenueReport />}
        {activeTab === "cash-drawer" && <CashDrawerReport />}
      </div>
    </div>
  );
}

export default ReportMgt;
