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
    <div className="w-full  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 text-gray-100 shadow-2xl rounded-2xl p-8 border border-gray-700">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white border-b border-gray-700 pb-4 mb-8">
          Role Management
        </h1>

        {/* Form Section */}
        <form className="space-y-8">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Role Name
            </label>
            <input
              type="text"
              placeholder="e.g. Cashier"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter a descriptive name for the role.
            </p>
          </div>

          {/* Permissions */}
          <div>
            <p className="font-semibold text-gray-200 mb-3">Permissions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {permissions.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center space-x-2 p-3 bg-gray-700/60 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 border-gray-500 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{perm}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition"
            >
              Save Role
            </button>
          </div>
        </form>

        {/* Divider */}
        <hr className="my-10 border-gray-700" />

        {/* Roles Table */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Existing Roles
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-700/80 text-gray-300 text-sm font-medium">
                <tr>
                  <th className="text-left py-3 px-4 border-b border-gray-600">Role</th>
                  <th className="text-left py-3 px-4 border-b border-gray-600">Permissions</th>
                  <th className="text-left py-3 px-4 border-b border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="hover:bg-gray-700/60 transition">
                  <td className="py-3 px-4 border-b border-gray-700 font-medium text-white">
                    Admin
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">
                    <span className="inline-flex items-center px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                      All Access
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 space-x-2">
                    <button className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition">
                      Delete
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-700/60 transition">
                  <td className="py-3 px-4 border-b border-gray-700 font-medium text-white">
                    Cashier
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                        Process Sales
                      </span>
                      <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full">
                        Refund Items
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 space-x-2">
                    <button className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* More rows can go here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;
