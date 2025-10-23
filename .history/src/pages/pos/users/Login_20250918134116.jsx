import React from "react";
import {
  cilUser,
  cilSave,
  cilPencil,
  cilTrash,
  cilCheckCircle,
  cilBan,
  cilSearch,
  cilFilter,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

function Login() {
  return (
    <div className="space-y-8 p-6">
      {/* 🔹 User Form Section */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-3 flex items-center font-semibold">
          <CIcon icon={cilUser} className="w-5 h-5 mr-2" />
          Add / Manage User Login
        </div>
        <div className="p-6">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username / Email
              </label>
              <input
                type="text"
                placeholder="e.g. john@store.com"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Role
              </label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>Select Role</option>
                <option>Admin</option>
                <option>Cashier</option>
                <option>Manager</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="md:col-span-3 text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <CIcon icon={cilSave} className="w-4 h-4" />
                Save User
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🔹 Users Table Section */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 bg-gray-50 border-b gap-3">
          <span className="font-semibold text-gray-700">User Accounts</span>

          {/* Search + Filter */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="px-2 text-gray-500">
                <CIcon icon={cilSearch} className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search user..."
                className="px-3 py-2 focus:outline-none"
              />
            </div>

            <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>Filter by Role</option>
              <option>Admin</option>
              <option>Cashier</option>
              <option>Manager</option>
            </select>

            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2">
              <CIcon icon={cilFilter} className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-6 py-3">john@store.com</td>
                <td className="px-6 py-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    Cashier
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Active
                  </span>
                </td>
                <td className="px-6 py-3">2025-09-18</td>
                <td className="px-6 py-3 flex justify-center gap-2">
                  <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-600">
                    <CIcon icon={cilPencil} className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600">
                    <CIcon icon={cilBan} className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-600">
                    <CIcon icon={cilCheckCircle} className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-6 py-3">mary@store.com</td>
                <td className="px-6 py-3">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                    Manager
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                </td>
                <td className="px-6 py-3">2025-09-10</td>
                <td className="px-6 py-3 flex justify-center gap-2">
                  <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-600">
                    <CIcon icon={cilPencil} className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600">
                    <CIcon icon={cilTrash} className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-600">
                    <CIcon icon={cilCheckCircle} className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Login;
