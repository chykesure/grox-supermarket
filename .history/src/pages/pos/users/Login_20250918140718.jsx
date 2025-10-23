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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 space-y-8 text-gray-100">
      {/* 🔹 User Form Section */}
      <div className="w-full bg-gray-800 shadow-xl rounded-2xl border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center font-semibold">
          <CIcon icon={cilUser} className="w-5 h-5 mr-2" />
          Add / Manage User Login
        </div>
        <div className="p-6">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username / Email
              </label>
              <input
                type="text"
                placeholder="e.g. john@store.com"
                className="w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Assign Role
              </label>
              <select className="w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>Select Role</option>
                <option>Admin</option>
                <option>Cashier</option>
                <option>Manager</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select className="w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="col-span-1 md:col-span-3 text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg inline-flex items-center gap-2 shadow-lg transition"
              >
                <CIcon icon={cilSave} className="w-4 h-4" />
                Save User
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🔹 Users Table Section */}
      <div className="w-full bg-gray-800 shadow-xl rounded-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 bg-gray-700/60 border-b border-gray-700 gap-3">
          <span className="font-semibold text-white">User Accounts</span>

          {/* Search + Filter */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden bg-gray-700 w-full md:w-auto">
              <span className="px-2 text-gray-400">
                <CIcon icon={cilSearch} className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search user..."
                className="px-3 py-2 w-full bg-transparent text-gray-100 focus:outline-none placeholder-gray-400"
              />
            </div>

            <select className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-auto">
              <option>Filter by Role</option>
              <option>Admin</option>
              <option>Cashier</option>
              <option>Manager</option>
            </select>

            <button className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2 w-full md:w-auto transition">
              <CIcon icon={cilFilter} className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-gray-200">
            <thead className="bg-gray-700 text-left text-gray-300">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-700 hover:bg-gray-700/50 transition">
                <td className="px-6 py-3">john@store.com</td>
                <td className="px-6 py-3">
                  <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                    Cashier
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    Active
                  </span>
                </td>
                <td className="px-6 py-3">2025-09-18</td>
                <td className="px-6 py-3 flex justify-center gap-2">
                  <button className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-blue-400">
                    <CIcon icon={cilPencil} className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400">
                    <CIcon icon={cilBan} className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-600/20 hover:bg-green-600/40 rounded-lg text-green-400">
                    <CIcon icon={cilCheckCircle} className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr className="border-t border-gray-700 hover:bg-gray-700/50 transition">
                <td className="px-6 py-3">mary@store.com</td>
                <td className="px-6 py-3">
                  <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                    Manager
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                </td>
                <td className="px-6 py-3">2025-09-10</td>
                <td className="px-6 py-3 flex justify-center gap-2">
                  <button className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-blue-400">
                    <CIcon icon={cilPencil} className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400">
                    <CIcon icon={cilTrash} className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-600/20 hover:bg-green-600/40 rounded-lg text-green-400">
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
