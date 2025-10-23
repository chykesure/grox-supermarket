import React, { useState } from "react";
import { FileSpreadsheet, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Payroll = () => {
  const [month, setMonth] = useState("October 2025");
  const [payrolls, setPayrolls] = useState([
    { id: 1, employee: "John Doe", salary: 250000, month: "October 2025", status: "Paid" },
    { id: 2, employee: "Sarah Johnson", salary: 320000, month: "October 2025", status: "Pending" },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Payroll Management</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" /> Generate Payroll
        </Button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="w-4 h-4 text-gray-400" />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:ring-2 focus:ring-emerald-500"
        >
          <option>October 2025</option>
          <option>September 2025</option>
          <option>August 2025</option>
        </select>
      </div>

      {/* Payroll Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent>
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-700 text-gray-400">
              <tr>
                <th className="py-3 text-left">Employee</th>
                <th className="py-3 text-left">Month</th>
                <th className="py-3 text-left">Salary (₦)</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((item) => (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3">{item.employee}</td>
                  <td className="py-3">{item.month}</td>
                  <td className="py-3">{item.salary.toLocaleString()}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Paid"
                          ? "bg-emerald-700 text-emerald-200"
                          : "bg-yellow-700 text-yellow-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payroll;
