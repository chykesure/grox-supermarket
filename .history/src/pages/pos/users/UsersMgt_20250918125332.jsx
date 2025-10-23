import React, { useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import Banner from "../../partials/Banner";

function UsersMgt() {
    const [sidebarOpen, setSidebarOpen] = useState(false);


    const { subpage } = useParams();
    const [activeTab, setActiveTab] = useState(subpage || "roles");

    useEffect(() => {
        if (subpage) setActiveTab(subpage);
    }, [subpage]);

    const renderTabContent = () => {
        switch (activeTab) {
            case "role":
                return (
                    <div className="p-6 bg-white rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-4">Manage Roles</h2>
                        <p className="text-gray-600">
                            Here you can create, assign, and edit roles for your users.
                        </p>
                        {/* 🔹 Replace with your actual role management form/table */}
                    </div>
                );
            case "login":
                return (
                    <div className="p-6 bg-white rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-4">User Login</h2>
                        <p className="text-gray-600">
                            Control login access, view sessions, or force logouts.
                        </p>
                        {/* 🔹 Replace with login controls */}
                    </div>
                );
            case "password":
                return (
                    <div className="p-6 bg-white rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-4">Password Management</h2>
                        <p className="text-gray-600">
                            Reset or update user passwords securely.
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

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-6xl mx-auto">
                        {/* Title */}
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                                User Management
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Manage roles, login access, and passwords from one place.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex space-x-6 -mb-px">
                                <button
                                    className={`pb-2 border-b-2 text-sm font-medium ${activeTab === "role"
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    onClick={() => setActiveTab("role")}
                                >
                                    Role
                                </button>
                                <button
                                    className={`pb-2 border-b-2 text-sm font-medium ${activeTab === "login"
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    onClick={() => setActiveTab("login")}
                                >
                                    Login
                                </button>
                                <button
                                    className={`pb-2 border-b-2 text-sm font-medium ${activeTab === "password"
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    onClick={() => setActiveTab("password")}
                                >
                                    Password
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        {renderTabContent()}
                    </div>
                </main>

                <Banner />
            </div>
        </div>
    );
}

export default UsersMgt;
