// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  Boxes,
  UserCheck,
  BarChart3,
  Settings,
} from "lucide-react";

const SidebarLinkGroup = ({ label, icon: Icon, to, subLinks = [] }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Parent is active if route starts with parent `to` or matches any child
  const parentActive =
    location.pathname.startsWith(to) ||
    subLinks.some((sublink) => location.pathname.startsWith(sublink.to));

  // Auto-open parent when active
  useEffect(() => {
    if (parentActive) setOpen(true);
    else setOpen(false); // close when not active
  }, [parentActive]);

  return (
    <div>
      {/* Parent Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
          parentActive
            ? "bg-blue-600/20 text-blue-300 font-semibold border-l-4 border-blue-500"
            : "text-gray-400 hover:text-white hover:bg-gray-800/70 border-transparent"
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          {label}
        </span>
        {subLinks.length > 0 && (
          <span className="text-xs">{open ? "▾" : "▸"}</span>
        )}
      </button>

      {/* Sub-links */}
      {open && subLinks.length > 0 && (
        <div className="pl-8 mt-1 space-y-1">
          {subLinks.map((sublink) => (
            <NavLink
              key={sublink.to}
              to={sublink.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "text-blue-300 bg-blue-600/20 border-l-4 border-blue-500"
                    : "text-gray-500 hover:text-white hover:bg-gray-800/70"
                }`
              }
            >
              {sublink.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-200 z-40 transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="h-full flex flex-col py-6 space-y-4">
        <div className="px-6 text-lg font-bold text-blue-400">POS</div>
        <nav className="flex-1 space-y-2 px-2">
          {/* Users Management */}
          <SidebarLinkGroup
            label="Users Management"
            icon={Users}
            to="/users"
            subLinks={[
              { to: "/users/roles", label: "Roles" },
              { to: "/users/login", label: "Login" },
              { to: "/users/password", label: "Password" },
            ]}
          />

          {/* Products */}
          <SidebarLinkGroup
            label="Products"
            icon={Package}
            to="/products"
            subLinks={[
              { to: "/products/add", label: "Add Product" },
              { to: "/products/list", label: "Product List" },
            ]}
          />

          {/* Sales */}
          <SidebarLinkGroup
            label="Sales"
            icon={ShoppingCart}
            to="/sales"
            subLinks={[
              { to: "/sales/scan", label: "Scan Items" },
              { to: "/sales/history", label: "Sales History" },
            ]}
          />

          {/* Inventory */}
          <SidebarLinkGroup
            label="Inventory"
            icon={Boxes}
            to="/inventory"
            subLinks={[
              { to: "/inventory/stock-inout", label: "Stock In/Out" },
              { to: "/inventory/low-stock", label: "Low Stock" },
              { to: "/inventory/suppliers", label: "Suppliers" },
            ]}
          />

          {/* Customers */}
          <SidebarLinkGroup
            label="Customers"
            icon={UserCheck}
            to="/customers"
            subLinks={[
              { to: "/customers/list", label: "Customer List" },
              { to: "/customers/loans", label: "Customer Loans" },
            ]}
          />

          {/* Reports */}
          <SidebarLinkGroup
            label="Reports"
            icon={BarChart3}
            to="/reports"
            subLinks={[
              { to: "/reports/sales", label: "Sales Report" },
              { to: "/reports/inventory", label: "Inventory Report" },
            ]}
          />

          {/* Settings */}
          <SidebarLinkGroup label="Settings" icon={Settings} to="/settings" />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
