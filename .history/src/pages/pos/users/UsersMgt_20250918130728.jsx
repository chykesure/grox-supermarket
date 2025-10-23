import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../partials/Sidebar";
import Header from "../../../partials/Header";
import Banner from "../../../partials/Banner";

// Import tab pages
import Roles from "./Roles";
import Login from "./Login";
import Password from "./users/Password";

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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
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
                {["roles", "login", "password"].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-2 border-b-2 text-sm font-medium transition ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Active tab content */}
            {activeTab === "roles" && <Roles />}
            {activeTab === "login" && <Login />}
            {activeTab === "password" && <Password />}
          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
}

export default UsersMgt;
