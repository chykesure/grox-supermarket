import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  Briefcase,
  Package,
  ClipboardList,
  BarChart3,
  Settings,
  Building2,
  Wallet,
  TrendingUp,
  ShoppingCart,
  Truck,
  Layers,
  UserCheck,
  Key,
  LogOut,
} from "lucide-react";
import SidebarLinkGroup from "../SidebarLinkGroup";

function ErpSidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("erp-sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? true : storedSidebarExpanded === "true"
  );

  // Close sidebar on outside click
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Close on ESC
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Persist sidebar expansion
  useEffect(() => {
    localStorage.setItem("erp-sidebar-expanded", sidebarExpanded);
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  const modules = [
    {
      title: "Dashboard",
      key: "dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      defaultPath: "/erp-dashboard",
      flows: [
        { title: "Overview", icon: <TrendingUp className="w-4 h-4" />, path: "/erp-dashboard" },
      ],
    },
    {
      title: "Accounts",
      key: "account",
      icon: <Wallet className="w-5 h-5" />,
      defaultPath: "/erp/account/overview",
      flows: [
        { title: "Overview", icon: <BarChart3 className="w-4 h-4" />, path: "/erp/account/overview" },
        { title: "Revenue", icon: <CreditCard className="w-4 h-4" />, path: "/erp/account/revenue" },
        { title: "Expenses", icon: <FileText className="w-4 h-4" />, path: "/erp/account/expenses" },
        { title: "Payables", icon: <Wallet className="w-4 h-4" />, path: "/erp/account/payables" },
        { title: "Receivables", icon: <Wallet className="w-4 h-4" />, path: "/erp/account/receivables" },
      ],
    },
    {
      title: "Human Resources",
      key: "hr",
      icon: <Users className="w-5 h-5" />,
      defaultPath: "/erp/hr/employees",
      flows: [
        { title: "Employees", icon: <UserCheck className="w-4 h-4" />, path: "/erp/hr/employees" },
        { title: "Payroll", icon: <CreditCard className="w-4 h-4" />, path: "/erp/hr/payroll" },
        { title: "Attendance", icon: <ClipboardList className="w-4 h-4" />, path: "/erp/hr/attendance" },
        { title: "Leave", icon: <FileText className="w-4 h-4" />, path: "/erp/hr/leave" },
      ],
    },
    {
      title: "Procurement",
      key: "purchase",
      icon: <ShoppingCart className="w-5 h-5" />,
      defaultPath: "/erp/purchase/orders",
      flows: [
        { title: "Orders", icon: <ClipboardList className="w-4 h-4" />, path: "/erp/purchase/orders" },
        { title: "Suppliers", icon: <Truck className="w-4 h-4" />, path: "/erp/purchase/suppliers" },
        { title: "Approvals", icon: <FileText className="w-4 h-4" />, path: "/erp/purchase/approvals" },
      ],
    },
    {
      title: "Inventory",
      key: "inventory",
      icon: <Package className="w-5 h-5" />,
      defaultPath: "/erp/inventory/stock",
      flows: [
        { title: "Stock", icon: <Layers className="w-4 h-4" />, path: "/erp/inventory/stock" },
        { title: "Transfers", icon: <Truck className="w-4 h-4" />, path: "/erp/inventory/transfers" },
        { title: "Adjustments", icon: <FileText className="w-4 h-4" />, path: "/erp/inventory/adjustments" },
      ],
    },
    {
      title: "Assets",
      key: "assets",
      icon: <Briefcase className="w-5 h-5" />,
      defaultPath: "/erp/assets/list",
      flows: [
        { title: "Register", icon: <Building2 className="w-4 h-4" />, path: "/erp/assets/list" },
        { title: "Depreciation", icon: <BarChart3 className="w-4 h-4" />, path: "/erp/assets/depreciation" },
        { title: "Maintenance", icon: <FileText className="w-4 h-4" />, path: "/erp/assets/maintenance" },
      ],
    },
    {
      title: "Reports",
      key: "reports",
      icon: <BarChart3 className="w-5 h-5" />,
      defaultPath: "/erp/reports/summary",
      flows: [
        { title: "Summary", icon: <BarChart3 className="w-4 h-4" />, path: "/erp/reports/summary" },
        { title: "Financial", icon: <FileText className="w-4 h-4" />, path: "/erp/reports/financial" },
        { title: "HR", icon: <Users className="w-4 h-4" />, path: "/erp/reports/hr" },
        { title: "Inventory", icon: <Package className="w-4 h-4" />, path: "/erp/reports/inventory" },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      icon: <Settings className="w-5 h-5" />,
      defaultPath: "/erp/settings/roles",
      flows: [
        { title: "Roles & Permissions", icon: <Key className="w-4 h-4" />, path: "/erp/settings/roles" },
        { title: "Company Info", icon: <Building2 className="w-4 h-4" />, path: "/erp/settings/company" },
        { title: "Logout", icon: <LogOut className="w-4 h-4" />, path: "/erp-login" },
      ],
    },
  ];

  return (
    <div className="min-w-fit">
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 bg-gray-900/40 z-40 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 
          lg:static lg:translate-x-0 h-screen overflow-y-auto no-scrollbar
          w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64 shrink-0
          bg-white border-r border-gray-200 text-gray-700
          transition-all duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-3 border-b border-gray-100">
          <span className="text-lg font-bold text-blue-600 lg:hidden lg:sidebar-expanded:block 2xl:block">
            ERP
          </span>
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modules */}
        <div className="space-y-4 px-2">
          <h3 className="text-xs uppercase text-gray-400 font-semibold pl-3">Modules</h3>
          <ul className="mt-2">
            {modules.map((module) => {
              const parentActive = module.flows.some((flow) =>
                pathname.startsWith(flow.path)
              );
              return (
                <SidebarLinkGroup
                  key={module.key}
                  activecondition={parentActive}
                  initialOpen={parentActive}
                >
                  {(handleClick, open) => (
                    <>
                      {/* Parent Link */}
                      <a
                        href="#0"
                        className={`flex items-center justify-between px-3 py-2 rounded-md border-l-4 transition ${
                          parentActive
                            ? "bg-blue-50 text-blue-700 font-semibold border-blue-500"
                            : "text-gray-600 hover:text-blue-700 hover:bg-blue-50 border-transparent"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                          navigate(module.defaultPath);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div>{module.icon}</div>
                          <span className="text-sm font-medium lg:hidden lg:sidebar-expanded:inline 2xl:inline">
                            {module.title}
                          </span>
                        </div>
                        <svg
                          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                        </svg>
                      </a>

                      {/* Sub-links */}
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 space-y-1 ${!open && "hidden"}`}>
                          {module.flows.map((flow, i) => (
                            <li key={i}>
                              <NavLink
                                end
                                to={flow.path}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-2 py-1 rounded-md text-sm border-l-4 transition ${
                                    isActive
                                      ? "text-blue-700 bg-blue-50 border-blue-500 font-medium"
                                      : "text-gray-500 hover:text-blue-700 hover:bg-blue-50 border-transparent"
                                  }`
                                }
                              >
                                {flow.icon}
                                <span>{flow.title}</span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ErpSidebar;
