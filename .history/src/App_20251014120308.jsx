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
import InventoryMgt from "./pages/pos/inventory/InventoryMgt";

// Customers Management
import CustomersMgt from "./pages/pos/customers/CustomersMgt";

// Reports Management
import ReportMgt from "./pages/pos/reports/ReportMgt";

// ====================== ERP SECTION IMPORTS ======================
import ErpDashboard from "./pages/erp/Dashboard";
import EmployeesMgt from "./pages/erp/account/AccountMgt";
import VendorsMgt from "./pages/erp/assets/AssetsMgt";
import FinanceMgt from "./pages/erp/hr/HrMgt";
import ProjectsMgt from "./pages/erp/inventory/InventoryMgt";
import AssetsMgt from "./pages/erp/purchase/AssetsMgt";
import ErpReports from "./pages/erp/reports/ReportsMgt";
import ErpLogin from "./pages/erp/Login";

function App() {
  const location = useLocation();

  useEffect(() => {
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
      <Route path="/users/:subpage" element={<UsersMgt />} />
      <Route path="/users" element={<Navigate to="/users/roles" replace />} />

      {/* Products Management */}
      <Route path="/products/:subpage" element={<ProductsMgt />} />
      <Route path="/products" element={<Navigate to="/products/add" replace />} />

      {/* Sales Management */}
      <Route path="/sales/:subpage" element={<SalesMgt />} />
      <Route path="/sales" element={<Navigate to="/sales/scan-items" replace />} />

      {/* Inventory Management */}
      <Route path="/inventory/:subpage" element={<InventoryMgt />} />
      <Route path="/inventory" element={<Navigate to="/inventory/stock" replace />} />

      {/* Customers Management */}
      <Route path="/customers/:subpage" element={<CustomersMgt />} />
      <Route path="/customers" element={<Navigate to="/customers/add" replace />} />

      {/* Reports Management */}
      <Route path="/reports/:subpage" element={<ReportMgt />} />
      <Route path="/reports" element={<Navigate to="/reports/sales" replace />} />

      {/* ====================== ERP SECTION ====================== */}
      <Route path="/erp-dashboard" element={<ErpDashboard />} />
      <Route path="/erp-login" element={<ErpLogin />} />

      {/* Employees Management */}
      <Route path="/erp/employees/:subpage" element={<EmployeesMgt />} />
      <Route path="/erp/employees" element={<Navigate to="/erp/employees/list" replace />} />

      {/* Vendors Management */}
      <Route path="/erp/vendors/:subpage" element={<VendorsMgt />} />
      <Route path="/erp/vendors" element={<Navigate to="/erp/vendors/list" replace />} />

      {/* Finance Management */}
      <Route path="/erp/finance/:subpage" element={<FinanceMgt />} />
      <Route path="/erp/finance" element={<Navigate to="/erp/finance/overview" replace />} />

      {/* Projects Management */}
      <Route path="/erp/projects/:subpage" element={<ProjectsMgt />} />
      <Route path="/erp/projects" element={<Navigate to="/erp/projects/all" replace />} />

      {/* Assets Management */}
      <Route path="/erp/assets/:subpage" element={<AssetsMgt />} />
      <Route path="/erp/assets" element={<Navigate to="/erp/assets/list" replace />} />

      {/* ERP Reports */}
      <Route path="/erp/reports/:subpage" element={<ErpReports />} />
      <Route path="/erp/reports" element={<Navigate to="/erp/reports/summary" replace />} />

      {/* ====================== FALLBACK ====================== */}
      <Route
        path="*"
        element={<h1 className="text-center text-white mt-20">404 - Page Not Found</h1>}
      />
    </Routes>
  );
}

export default App;
