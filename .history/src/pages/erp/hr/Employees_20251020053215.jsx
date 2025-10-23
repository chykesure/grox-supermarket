import React, { useState, useEffect } from "react";
import { UserPlus, Edit2, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Employees = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", department: "Finance", role: "Accountant", email: "john@erp.com" },
    { id: 2, name: "Sarah Johnson", department: "HR", role: "HR Manager", email: "sarah@erp.com" },
  ]);

  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Employee Directory</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Employee Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent>
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-700 text-gray-400">
              <tr>
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Department</th>
                <th className="py-3 text-left">Role</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3">{emp.name}</td>
                  <td className="py-3">{emp.department}</td>
                  <td className="py-3">{emp.role}</td>
                  <td className="py-3">{emp.email}</td>
                  <td className="py-3 flex justify-center gap-3">
                    <Edit2 className="w-4 h-4 text-blue-400 cursor-pointer" />
                    <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
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

export default Employees;
