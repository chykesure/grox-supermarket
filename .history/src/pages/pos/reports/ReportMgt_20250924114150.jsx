// src/pages/reports/ReportMgt.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BarChart2, FileText, DollarSign, Inbox } from "lucide-react";

function ReportMgt() {
  const reports = [
    {
      id: 1,
      name: "Sales Report",
      path: "/reports/sales",
      icon: <FileText size={22} />,
      description: "View sales transactions and totals",
    },
    {
      id: 2,
      name: "Top Products",
      path: "/reports/top-products",
      icon: <BarChart2 size={22} />,
      description: "Analyze best-selling products",
    },
    {
      id: 3,
      name: "Revenue Report",
      path: "/reports/revenue",
      icon: <DollarSign size={22} />,
      description: "Track revenue trends",
    },
    {
      id: 4,
      name: "Cash Drawer",
      path: "/reports/cash-drawer",
      icon: <Inbox size={22} />,
      description: "Monitor cash inflow & outflow",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-400">Report Management</h1>
      <p className="text-gray-400">
        Access and manage different business reports below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Link
            key={report.id}
            to={report.path}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-700 transition-all shadow flex flex-col gap-3"
          >
            <div className="flex items-center gap-3 text-blue-300">
              {report.icon}
              <h2 className="text-lg font-semibold">{report.name}</h2>
            </div>
            <p className="text-gray-400 text-sm">{report.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ReportMgt;
