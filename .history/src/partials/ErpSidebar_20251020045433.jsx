import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  Users,
  ClipboardList,
  Package,
  Truck,
  FileText,
  Settings,
  Building2,
  CreditCard,
  TrendingUp,
  PieChart,
  UserCheck,
  CalendarCheck,
  Wrench,
  Shield,
} from "lucide-react";
import SidebarLinkGroup from "./SidebarLinkGroup";

function Sidebar({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Handle click outside
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

  // Handle Esc key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Expand persistence
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // ERP Modules
  const modules = [
    {
      title: "Dashboard",
      key: "dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      defaultPath: "/erp-dashboard",
      flows: [
        { title: "Overview", icon: <PieChart className="w-4 h-4" />, path: "/erp-dashboard" },
      ],
    },
    {
      title: "Finance",
      key: "finance",
      icon: <DollarSign className="w-5 h-5" />,
      defaultPath: "/erp/finance/revenue",
      flows: [
        { title: "Revenue", icon: <TrendingUp className="w-4 h-4" />, path: "/erp/finance/revenue" },
        { title: "Expenses", icon: <CreditCard className="w-4 h-4" />, path: "/erp/finance/expenses" },
        { title: "Payables", icon: <FileText className="w-4 h-4" />, path: "/erp/finance/payables" },
        { title: "Receivables", icon: <FileText className="w-4 h-4" />, path: "/erp/finance/receivables" },
      ],
    },
    {
      title: "HR Management",
      key: "hr",
      icon: <Users className="w-5 h-5" />,
      defaultPath: "/erp/hr/employees",
      flows: [
        { title: "Employees", icon: <UserCheck className="w-4 h-4" />, path: "/erp/hr/employees" },
        { title: "Payroll", icon: <CreditCard className="w-4 h-4" />, path: "/erp/hr/payroll" },
        { title: "Leave Requests", icon: <CalendarCheck className="w-4 h-4" />, path: "/erp/hr/leaves" },
        { title: "Attendance", icon: <ClipboardList className="w-4 h-4" />, path: "/erp/hr/attendance" },
      ],
    },
    {
      title: "Procurement",
      key: "procurement",
      icon: <Truck className="w-5 h-5" />,
      defaultPath: "/erp/procurement/purchase-orders",
      flows: [
        { title: "Purchase Orders", icon: <FileText className="w-4 h-4" />, path: "/erp/procurement/purchase-orders" },
        { title: "Suppliers", icon: <Briefcase className="w-4 h-4" />, path: "/erp/procurement/suppliers" },
        { title: "Approvals", icon: <Shield className="w-4 h-4" />, path: "/erp/procurement/approvals" },
      ],
    },
    {
      title: "Inventory",
      key: "inventory",
      icon: <Package className="w-5 h-5" />,
      defaultPath: "/erp/inventory/stock",
      flows: [
        { title: "Stock", icon: <Package className="w-4 h-4" />, path: "/erp/inventory/stock" },
        { title: "Transfers", icon: <Truck className="w-4 h-4" />, path: "/erp/inventory/transfers" },
        { title: "Adjustments", icon: <ClipboardList className="w-4 h-4" />, path: "/erp/inventory/adjustments" },
      ],
    },
    {
      title: "Assets",
      key: "assets",
      icon: <Building2 className="w-5 h-5" />,
      defaultPath: "/erp/assets/register",
      flows: [
        { title: "Register", icon: <FileText className="w-4 h-4" />, path: "/erp/assets/register" },
        { title: "Depreciation", icon: <TrendingUp className="w-4 h-4" />, path: "/erp/assets/depreciation" },
        { title: "Maintenance", icon: <Wrench className="w-4 h-4" />, path: "/erp/assets/maintenance" },
      ],
    },
    {
      title: "Reports",
      key: "reports",
      icon: <FileText className="w-5 h-5" />,
      defaultPath: "/erp/reports/finance",
      flows: [
        { title: "Financial Reports", icon: <FileText className="w-4 h-4" />, path: "/erp/reports/finance" },
        { title: "HR Reports", icon: <Users className="w-4 h-4" />, path: "/erp/reports/hr" },
        { title: "Inventory Reports", icon: <Package className="w-4 h-4" />, path: "/erp/reports/inventory" },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      icon: <Settings className="w-5 h-5" />,
      defaultPath: "/erp/settings/roles",
      flows: [
        { title: "Roles & Permissions", icon: <Shield className="w-4 h-4" />, path: "/erp/settings/roles" },
        { title: "Company Info", icon: <Building2 className="w-4 h-4" />, path: "/erp/settings/company" },
      ],
    },
  ];

  return (
    <div className="min-w-fit">
      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0
          lg:static lg:translate-x-0
          h-screen overflow-y-auto no-scrollbar
          w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64 shrink-0
          bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          text-gray-200 border-r border-gray-700
          transition-all duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          ${variant === "v2" ? "border-r border-gray-700" : "shadow-lg"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-2 sticky top-0 bg-gray-900/90 backdrop-blur-sm z-10 py-3 rounded-md">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent lg:hidden lg:sidebar-expanded:block 2xl:block">
            ERP
          </span>
          <button
            ref={trigger}
            className="lg:hidden text-gray-400 hover:text-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase text-gray-400 font-semibold pl-3">
            Modules
          </h3>
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
                            ? "bg-blue-600/20 text-blue-300 font-semibold border-blue-500"
                            : "text-gray-400 hover:text-white hover:bg-gray-800/70 border-transparent"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                          navigate(module.defaultPath);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-gray-400">{module.icon}</div>
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
                                      ? "text-blue-300 bg-blue-600/20 border-blue-500 font-medium"
                                      : "text-gray-500 hover:text-white hover:bg-gray-800/70 border-transparent"
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

export default Sidebar;
