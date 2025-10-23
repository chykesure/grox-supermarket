import React, { useState } from "react";
import { Plane, Check, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Leave = () => {
  const [requests, setRequests] = useState([
    { id: 1, employee: "John Doe", type: "Annual", from: "2025-10-25", to: "2025-10-30", status: "Pending" },
    { id: 2, employee: "Sarah Johnson", type: "Sick", from: "2025-10-18", to: "2025-10-20", status: "Approved" },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Leave Management</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
          <Plane className="w-4 h-4" /> Request Leave
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent>
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-700 text-gray-400">
              <tr>
                <th className="py-3 text-left">Employee</th>
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">From</th>
                <th className="py-3 text-left">To</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3">{r.employee}</td>
                  <td className="py-3">{r.type}</td>
                  <td className="py-3">{r.from}</td>
                  <td className="py-3">{r.to}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === "Approved"
                          ? "bg-emerald-700 text-emerald-200"
                          : r.status === "Pending"
                          ? "bg-yellow-700 text-yellow-200"
                          : "bg-red-700 text-red-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 flex justify-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 cursor-pointer" />
                    <X className="w-4 h-4 text-red-500 cursor-pointer" />
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

export default Leave;
