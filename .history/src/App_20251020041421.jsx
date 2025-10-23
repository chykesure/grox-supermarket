import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

// ====================== POS SECTION IMPORTS ======================
import Dashboard from "./pages/pos/Dashboard";
import Menu from "./pages/Menu";
import LoginPage from "./pages/pos/Login";

// Users Management
import UsersMgt from "./pages/pos/users/UsersMgt";

// Products Management
import ProductsMgt from "./pages/pos/products/ProductsMgt";

// Sales Management
import SalesMgt from "./pages/pos/sales/SalesMgt";

// Inventory Management
import PosInventoryMgt from "./pages/pos/inventory/InventoryMgt";

// Customers Management
import CustomersMgt from "./pages/pos/customers/CustomersMgt";

// Reports Management
import ReportMgt from "./pages/pos/reports/ReportMgt";

// ====================== ERP SECTION IMPORTS ======================
import ErpDashboard from "./pages/erp/Dashboard";
import ErpLogin from "./pages/erp/Login";
import AccountMgt from "./pages/erp/accounts/AccountMgt";
import AssetsMgt from "./pages/erp/assets/AssetsMgt";
import HrMgt from "./pages/erp/hr/HrMgt";
import ErpInventoryMgt from "./pages/erp/inventory/InventoryMgt";
import PurchaseMgt from "./pages/erp/purchase/PurchaseMgt";
import ReportsMgt from "./pages/erp/reports/ReportsMgt";

function App() {
  const location = useLocation();

  useEffect(() => {
    // Smooth scroll reset on route change
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Routes>
      {/* ====================== DEFAULT / MENU ====================== */}
      <Route exact path="/" element={<Menu />} />

      {/* ====================== POS SECTION ====================== */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pos-login" element={<LoginPage />} />

      {/* Users Management */}
      

      {/* ====================== FALLBACK ====================== */}
      <Route
        path="*"
        element={<h1 className="text-center text-white mt-20">404 - Page Not Found</h1>}
      />
    </Routes>
  );
}

export default App;
