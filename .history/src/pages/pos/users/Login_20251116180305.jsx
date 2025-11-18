import React, { useState, useEffect } from "react";
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
import axios from "axios";
import Swal from "sweetalert2";

interface UserType {
  id: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

function Login() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filterRole, setFilterRole] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    role: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = "/api/users"; // adjust this to your backend endpoint

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.email || !newUser.role || !newUser.status) {
      return Swal.fire("Warning", "Please fill all fields", "warning");
    }

    setLoading(true);
    try {
      const res = await axios.post(API_URL, newUser);
      Swal.fire("Success", res.data.message || "User added", "success");
      setNewUser({ email: "", role: "", status: "Active" });
      fetchUsers();
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed to add user", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on selected role
  const filteredUsers = filterRole
    ? users.filter((user) => user.role === filterRole)
    : users;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 space-y-8 text-gray-100">
      {/* 🔹 User Form Section */}
      <div className="w-full bg-gray-800 shadow-xl rounded-2xl border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center font-semibold">
          <CIcon icon={cilUser} className="w-5 h-5 mr-2" />
          Add / Manage User Login
        </div>
        <div className="p-6">
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
            onSubmit={handleAddUser}
          >
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username / Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. john@store.com"
                value={newUser.email}
                onChange={handleInputChange}
                className="w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Assign Role
              </label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Role</option>
                <option value="Super-Admin">Super-Admin</option>
                <option value="Admin">Admin</option>
                <option value="Cashier">Cashier</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={newUser.status}
                onChange={handleInputChange}
                className="w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="col-span-1 md:col-span-3 text-right">
              <button
                type="submit"
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg inline-flex items-center gap-2 shadow-lg transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                <CIcon icon={cilSave} className="w-4 h-4" />
                {loading ? "Saving..." : "Save User"}
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

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-auto"
            >
              <option value="">Filter by Role</option>
              <option value="Super-Admin">Super-Admin</option>
              <option value="Admin">Admin</option>
              <option value="Cashier">Cashier</option>
              <option value="Manager">Manager</option>
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-700 hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "Super-Admin"
                          ? "bg-purple-600/20 text-purple-400"
                          : user.role === "Admin"
                          ? "bg-blue-600/20 text-blue-400"
                          : user.role === "Cashier"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">{user.lastLogin}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Login;
