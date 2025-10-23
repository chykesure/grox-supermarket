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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main wrapper */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main content - fills remaining height */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 px-6 py-4 w-full max-w-9xl mx-auto flex flex-col">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Accounts Management
              </h1>
              <p className="text-gray-400 mt-1 mb-4">
                Monitor financial performance, revenue, expenses, and more.
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-4">
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
            <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700 flex items-start justify-start">
              {renderTabContent()}
            </div>
          </div>
        </main>

        {/* Footer / Banner */}
        <div className="mt-auto">
          <Banner />
        </div>
      </div>
    </div>
  );
}

export default AccountMgt;
