import React from "react";

function Roles() {
  const permissions = [
    "View Reports",
    "Manage Customers",
    "Process Sales",
    "Refund Items",
    "Manage Users",
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">
          Role Management
        </h1>

        {/* Form Section */}
        <form className="space-y-8">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role Name
            </label>
            <input
              type="text"
              placeholder="e.g. Cashier"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a descriptive name for the role.
            </p>
          </div>

          {/* Permissions */}
          <div>
            <p className="font-semibold text-gray-700 mb-3">Permissions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {permissions.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{perm}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow hover:bg-blue-700 transition"
            >
              Save Role
            </button>
          </div>
        </form>

        {/* Divider */}
        <hr className="my-10" />

        {/* Roles Table */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Existing Roles
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
                <tr>
                  <th className="text-left py-3 px-4 border-b">Role</th>
                  <th className="text-left py-3 px-4 border-b">Permissions</th>
                  <th className="text-left py-3 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium">Admin</td>
                  <td className="py-3 px-4 border-b">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      All Access
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b space-x-2">
                    <button className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium">Cashier</td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Process Sales
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Refund Items
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b space-x-2">
                    <button className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* More rows... */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;
