import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../partials/Sidebar";
import Header from "../../../partials/Header";
import Banner from "../../../partials/Banner";

// Import tab pages
import Roles from "./Roles";
import Login from "./Login";
import Password from "./Password";

function UsersMgt() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { subpage } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(subpage || "roles");

  useEffect(() => {
    if (subpage) setActiveTab(subpage);
  }, [subpage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/users/${tab}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "roles":
        return <Roles />;
      case "login":
        return <Login />;
      case "password":
        return <Password />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main wrapper */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage roles, login access, and password policies.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-gray-700">
              <nav className="flex space-x-8 -mb-px">
                {["roles", "login", "password"].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-3 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "border-b-2 border-blue-500 text-blue-400"
                        : "border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl border border-gray-700">
              {renderTabContent()}
            </div>
          </div>
        </main>

        {/* Banner / Footer */}
        <Banner />
      </div>
    </div>
  );
}

export default UsersMgt;
