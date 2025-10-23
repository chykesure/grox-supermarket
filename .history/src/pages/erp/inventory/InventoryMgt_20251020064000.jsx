import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../partials/ErpSidebar";
import Header from "../../../partials/Header";
import Banner from "../../../partials/Banner";

// Import Inventory sub-pages
import StockPage from "./StockPage";
import TransfersPage from "./TransfersPage";
import AdjustmentsPage from "./AdjustmentsPage";

const InventoryMgt = () => {
  const { subpage } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!subpage) {
      navigate("/erp/inventory/stock", { replace: true });
    }
  }, [subpage, navigate]);

  const activeTab = subpage || "stock";

  const handleTabChange = (tab) => {
    navigate(`/erp/inventory/${tab}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "stock":
        return <StockPage />;
      case "transfers":
        return <TransfersPage />;
      case "adjustments":
        return <AdjustmentsPage />;
      default:
        return <StockPage />;
    }
  };

  return (
    <div className="flex overflow-hidden bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 text-gray-200 min-h-screen">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4 w-full">
            <div className="mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
                Inventory Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage stock, transfers, and inventory adjustments efficiently.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-700">
              <nav className="flex space-x-8 -mb-px">
                {["stock", "transfers", "adjustments"].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-2 text-sm font-medium transition ${
                      activeTab === tab
                        ? "border-b-2 border-emerald-500 text-emerald-400"
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
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
              {renderTabContent()}
            </div>
          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
};

export default InventoryMgt;
