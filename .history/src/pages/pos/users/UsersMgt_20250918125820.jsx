import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../partials/Sidebar";
import Header from "../../partials/Header";
import Banner from "../../partials/Banner";

function UsersMgt() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Read URL subpage (roles / login / password)
  const { subpage } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(subpage || "roles");

  // Sync tab state with URL
  useEffect(() => {
    if (subpage) setActiveTab(subpage);
  }, [subpage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/users/${tab}`); // update URL when switching tabs
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "roles":
        return (
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Manage Roles</h2>
            <p className="text-gray-600">
              Define, assign, and manage user roles and permissions here.
            </p>
            {/* 🔹 Replace with roles table / form */}
          </div>
        );
      case "login":
        return (
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">User Login</h2>
            <p className="text-gray-600">
              Control login access, monitor sessions, or enforce policies.
            </p>
            {/* 🔹 Replace with login management */}
          </div>
        );
      case "password":
        return (
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Password Management</h2>
            <p className="text-gray-600">
              Reset, update, or enforce strong passwords for users.
            </p>
            {/* 🔹 Replace with password reset form */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-6xl mx-auto">
            {/* Page title */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                User Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage roles, login access, and password policies.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-6 -mb-px">
                <button
                  className={`pb-2 border-b-2 text-sm font-medium transition ${
                    activeTab === "roles"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => handleTabChange("roles")}
                >
                  Roles
                </button>
                <button
                  className={`pb-2 border-b-2 text-sm font-medium transition ${
                    activeTab === "login"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => handleTabChange("login")}
                >
                  Login
                </button>
                <button
                  className={`pb-2 border-b-2 text-sm font-medium transition ${
                    activeTab === "password"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => handleTabChange("password")}
                >
                  Password
                </button>
              </nav>
            </div>

            {/* Active tab content */}
            {renderTabContent()}
          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
}

export default UsersMgt;
