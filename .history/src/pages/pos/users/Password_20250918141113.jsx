import React from "react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilReload, cilShieldAlt } from "@coreui/icons";

function Password() {
  return (
    <div className="w-full min-h-screen bg-gray-100 py-10 px-4">
      {/* Card */}
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center gap-2">
          <CIcon icon={cilLockLocked} className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Password Management</h1>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Form Section */}
          <form className="grid gap-6">
            {/* Select User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select User
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>Select User</option>
                <option>john@store.com</option>
                <option>mary@store.com</option>
              </select>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Force Change Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="forceChange"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="forceChange" className="text-sm text-gray-700">
                Force password change on next login
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg inline-flex items-center gap-2 shadow-md"
              >
                <CIcon icon={cilReload} className="w-4 h-4" />
                Reset Password
              </button>
            </div>
          </form>

          {/* Password Policy */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <CIcon icon={cilShieldAlt} className="w-5 h-5 text-blue-600" />
              Password Policy
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                Minimum 8 characters
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                At least 1 uppercase, 1 number, 1 special character
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                Password expires every 90 days
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Password;
