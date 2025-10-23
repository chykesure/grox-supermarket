// SalesMgt.jsx
import React from "react";
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

            {/* Sections */}
            <div className="space-y-8">
              {/* Scan Items */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Scan Items</h2>
                <ScanItems />
              </section>

              {/* Adjust Quantity */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Adjust Quantity</h2>
                <AdjustQty />
              </section>

              {/* Coupons */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Coupons</h2>
                <Coupons />
              </section>

              {/* Payments */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Payments</h2>
                <Payments />
              </section>

              {/* Receipt */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Receipt</h2>
                <Receipt />
              </section>
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
