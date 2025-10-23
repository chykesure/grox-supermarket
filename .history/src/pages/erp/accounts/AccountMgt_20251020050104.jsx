import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../partials/ErpSidebar";
import Header from "../../../partials/Header";
import Banner from "../../../partials/Banner";

// Placeholder subpages
// import AccountOverview from "./Overview";
// import Transactions from "./Transactions";
// import Ledger from "./Ledger";

function AccountMgt() {
  const { subpage } = useParams();
  const navigate = useNavigate();

  // Redirect to /erp/account/overview if no subpage
  useEffect(() => {
    if (!subpage) {
      navigate("/erp/account/overview", { replace: true });
    }
  }, [subpage, navigate]);

  const activeTab = subpage || "overview";

  const handleTabChange = (tab) => {
    navigate(`/erp/account/${tab}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="text-gray-300">
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
              Account Overview
            </h2>
            <p className="text-gray-400">
              Summary of financial activities, assets, and performance metrics.
            </p>
          </div>
        );
      case "transactions":
        return (
          <div className="text-gray-300">
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
              Transactions
            </h2>
            <p className="text-gray-400">
              View all incoming and outgoing transactions across departments.
            </p>
          </div>
        );
      case "ledger":
        return (
          <div className="text-gray-300">
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
              General Ledger
            </h2>
            <p className="text-gray-400">
              Detailed accounting entries and financial movements.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex overflow-hidden bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main wrapper */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4 w-full">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Account Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage company accounts, ledgers, and financial records.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-700">
              <nav className="flex space-x-8 -mb-px">
                {["overview", "transactions", "ledger"].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-2 text-sm font-medium transition-all ${
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
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700 overflow-y-auto max-h-[calc(100vh-220px)]">
              {renderTabContent()}
            </div>
          </div>
        </main>

        {/* Footer Banner */}
        <Banner />
      </div>
    </div>
  );
}

export default AccountMgt;
