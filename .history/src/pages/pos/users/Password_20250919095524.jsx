import React from "react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilReload, cilShieldAlt } from "@coreui/icons";

function Password() {
  return (
    <div className="w-full  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4">
      {/* Card */}
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-xl border border-gray-600">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-4 flex items-center gap-2 rounded-t-2xl">
          <CIcon icon={cilLockLocked} className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Password Management</h1>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8 text-gray-200">
          {/* Form Section */}
          <form className="grid gap-6">
            {/* Select User */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select User
              </label>
              <select className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200">
                <option>Select User</option>
                <option>john@store.com</option>
                <option>mary@store.com</option>
              </select>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200 placeholder-gray-500"
              />
            </div>

            {/* Force Change Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="forceChange"
                className="h-4 w-4 text-blue-500 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="forceChange" className="text-sm text-gray-300">
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
            <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2 mb-3">
              <CIcon icon={cilShieldAlt} className="w-5 h-5 text-blue-500" />
              Password Policy
            </h2>
            <ul className="space-y-2 text-sm text-gray-300">
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
