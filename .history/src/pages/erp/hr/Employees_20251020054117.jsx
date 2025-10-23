import React, { useState } from "react";
import { UserPlus, Edit2, Trash2, Search } from "lucide-react";

// -----------------------------
// Inline UI Components
// -----------------------------
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg text-white font-medium shadow-sm transition ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-md border border-gray-700 bg-gray-800 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// -----------------------------
// Main Page Component
// -----------------------------
const Employees = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", department: "Finance", role: "Accountant", email: "john@erp.com" },
    { id: 2, name: "Sarah Johnson", department: "HR", role: "HR Manager", email: "sarah@erp.com" },
    { id: 3, name: "Michael Brown", department: "IT", role: "Software Engineer", email: "michael@erp.com" },
    { id: 4, name: "Emily Clark", department: "Marketing", role: "Brand Manager", email: "emily@erp.com" },
  ]);

  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-emerald-400 tracking-tight">
          Employee Directory
        </h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Employee
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
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
      <Card>
        <CardContent>
          <table className="min-w-full text-sm text-gray-300">
            <thead className="border-b border-gray-700 text-gray-400 uppercase tracking-wide text-xs">
              <tr>
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Department</th>
                <th className="py-3 text-left">Role</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                  >
                    <td className="py-3">{emp.name}</td>
                    <td className="py-3">{emp.department}</td>
                    <td className="py-3">{emp.role}</td>
                    <td className="py-3">{emp.email}</td>
                    <td className="py-3 flex justify-center gap-3">
                      <Edit2 className="w-4 h-4 text-blue-400 cursor-pointer hover:scale-110 transition-transform" />
                      <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
