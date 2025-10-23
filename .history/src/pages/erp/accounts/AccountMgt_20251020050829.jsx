import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../partials/ErpSidebar";
import Header from "../../../partials/Header";
import Banner from "../../../partials/Banner";

// Import account sub-pages
import Overview from "./Overview";
import Revenue from "./Revenue";
import Expenses from "./Expenses";
import Payables from "./Payables";
import Receivables from "./Receivables";

function AccountMgt() {
  const { subpage } = useParams();
  const navigate = useNavigate();

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
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "revenue":
        return <Revenue />;
      case "expenses":
        return <Expenses />;
      case "payables":
        return <Payables />;
      case "receivables":
        return <Receivables />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex overflow-hidden bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 text-gray-200 min-h-screen">
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
                Accounts Management
              </h1>
              <p className="text-gray-400 mt-1">
                Monitor financial performance, revenue, expenses, and more.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-700">
              <nav className="flex space-x-8 -mb-px">
                {["overview", "revenue", "expenses", "payables", "receivables"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`pb-2 text-sm font-medium transition ${
                        activeTab === tab
                          ? "border-b-2 border-blue-500 text-blue-400"
                          : "border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
                      }`}
                      onClick={() => handleTabChange(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  )
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700 overflow-y-auto max-h-[calc(100vh-200px)]">
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

export default AccountMgt;
