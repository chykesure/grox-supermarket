import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

// Import pages
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
import InventoryMgt from "./pages/pos/customers/InventoryMgt";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Routes>
      {/* Default route */}
      <Route exact path="/" element={<Menu />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* POS login */}
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


      {/* // Inventory Management */}
      <Route path="/inventory/:subpage" element={<InventoryMgt />} />
      <Route path="/inventory" element={<Navigate to="/inventory/stock" replace />} />
      
      {/* // Customers Management */}
      <Route path="/customers/:subpage" element={<CustomersMgt />} />
      <Route path="/customers" element={<Navigate to="/customers/stock" replace />} />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<h1 className="text-center text-white mt-20">404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
