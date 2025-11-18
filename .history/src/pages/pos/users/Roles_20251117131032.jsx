import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Roles() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    status: "Active",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch users" });
    }
  };

  // Fetch roles for dropdown
  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/roles");
      const data = await res.json();
      if (res.ok) setRoles(data);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch roles" });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.role) {
      Swal.fire({ icon: "warning", title: "Incomplete", text: "Email & role required" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // role is string
      });
      const data = await res.json();
      if (!res.ok) Swal.fire({ icon: "error", title: "Error", text: data.message });
      else {
        Swal.fire({ icon: "success", title: "User added", timer: 1500, showConfirmButton: false });
        setFormData({ email: "", role: "", status: "Active" });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Server Error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error deleting user" });
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto bg-gray-800 text-gray-100 shadow-xl rounded-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6">Users</h1>

        {/* Add User Form */}
        <form className="flex flex-col sm:flex-row gap-4 mb-8" onSubmit={handleAddUser}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r._id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-lg">
            <thead className="bg-gray-700/80 text-gray-300 text-sm font-medium">
              <tr>
                <th className="py-3 px-4 text-left border-b border-gray-600">Email</th>
                <th className="py-3 px-4 text-left border-b border-gray-600">Role</th>
                <th className="py-3 px-4 text-left border-b border-gray-600">Status</th>
                <th className="py-3 px-4 text-left border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700/50 transition">
                  <td className="py-3 px-4 border-b border-gray-700">{user.email}</td>
                  <td className="py-3 px-4 border-b border-gray-700">
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
                      {user.role || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">{user.status}</td>
                  <td className="py-3 px-4 border-b border-gray-700 space-x-2">
                    <button
                      onClick={() => Swal.fire("Edit coming soon")}
                      className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md"
                    >
                      Delete
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

export default Roles;
