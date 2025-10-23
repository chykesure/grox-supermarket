import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Attendance = () => {
  const [records, setRecords] = useState([
    { id: 1, employee: "John Doe", date: "2025-10-20", checkIn: "08:45 AM", checkOut: "05:30 PM", status: "Present" },
    { id: 2, employee: "Sarah Johnson", date: "2025-10-20", checkIn: "09:00 AM", checkOut: "--", status: "Absent" },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Attendance Tracker</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Mark Attendance
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent>
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-700 text-gray-400">
              <tr>
                <th className="py-3 text-left">Employee</th>
                <th className="py-3 text-left">Date</th>
                <th className="py-3 text-left">Check-In</th>
                <th className="py-3 text-left">Check-Out</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3">{r.employee}</td>
                  <td className="py-3">{r.date}</td>
                  <td className="py-3">{r.checkIn}</td>
                  <td className="py-3">{r.checkOut}</td>
                  <td className="py-3">
                    {r.status === "Present" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
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

export default Attendance;
