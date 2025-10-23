// SalesMgt.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../partials/Sidebar";
import Header from "../../../partials/Header";
import Banner from "../../../partials/Banner";

// Import Sales sub-pages
import ScanItems from "./ScanItems";
import AdjustQty from "./AdjustQty";
import Coupons from "./Coupons";
import Payments from "./Payments";
import Receipt from "./Receipt";

function SalesMgt() {
  const { subpage } = useParams();
  const navigate = useNavigate();

  // Redirect to /sales/scan-items if no subpage
  useEffect(() => {
    if (!subpage) {
      navigate("/sales/scan-items", { replace: true });
    }
  }, [subpage, navigate]);

  const activeTab = subpage || "scan-items";

  const handleTabChange = (tab) => {
    navigate(`/sales/${tab}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "scan-items":
        return <ScanItems />;
      case "adjust-qty":
        return <AdjustQty />;
      case "coupons":
        return <Coupons />;
      case "payments":
        return <Payments />;
      case "receipt":
        return <Receipt />;
      default:
        return <ScanItems />; // fallback
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main wrapper */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Sales Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage scanning, quantity adjustments, coupons, payments, and receipts.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-700">
              <nav className="flex space-x-8 -mb-px">
                {["scan-items", "adjust-qty", "coupons", "payments", "receipt"].map(
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
                      {tab
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </button>
                  )
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
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

export default SalesMgt;
