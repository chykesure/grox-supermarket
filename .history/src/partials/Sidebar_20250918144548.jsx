import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Database,
  ShoppingCart,
  Truck,
  BarChart,
  Settings,
  LogIn,
  Key,
  UserCheck,
  PlusSquare,
  Edit,
  Tag,
  Percent,
  Box,
  AlertCircle,
  FileText,
  CreditCard,
  Printer,
  Star,
  History,
} from "lucide-react";

import SidebarLinkGroup from "./SidebarLinkGroup";

function Sidebar({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

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
  }, [sidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const modules = [
    {
      title: "Users Management",
      key: "users",
      icon: <Users className="w-5 h-5" />,
      flows: [
        { title: "Login", icon: <LogIn className="w-4 h-4" /> },
        { title: "Roles", icon: <UserCheck className="w-4 h-4" /> },
        { title: "Password", icon: <Key className="w-4 h-4" /> },
      ],
    },
    {
      title: "Products",
      key: "products",
      icon: <Database className="w-5 h-5" />,
      flows: [
        { title: "Add", icon: <PlusSquare className="w-4 h-4" /> },
        { title: "Edit", icon: <Edit className="w-4 h-4" /> },
        { title: "Categories", icon: <Tag className="w-4 h-4" /> },
        { title: "Discounts", icon: <Percent className="w-4 h-4" /> },
      ],
    },
    {
      title: "Sales",
      key: "sales",
      icon: <ShoppingCart className="w-5 h-5" />,
      flows: [
        { title: "Scan Items", icon: <Box className="w-4 h-4" /> },
        { title: "Adjust Qty", icon: <Edit className="w-4 h-4" /> },
        { title: "Coupons", icon: <Percent className="w-4 h-4" /> },
        { title: "Payments", icon: <CreditCard className="w-4 h-4" /> },
        { title: "Receipt", icon: <Printer className="w-4 h-4" /> },
      ],
    },
    {
      title: "Inventory",
      key: "inventory",
      icon: <Truck className="w-5 h-5" />,
      flows: [
        { title: "Stock In/Out", icon: <Box className="w-4 h-4" /> },
        { title: "Low Stock", icon: <AlertCircle className="w-4 h-4" /> },
        { title: "Suppliers", icon: <FileText className="w-4 h-4" /> },
      ],
    },
    {
      title: "Customers",
      key: "customers",
      icon: <Users className="w-5 h-5" />,
      flows: [
        { title: "Add/View", icon: <PlusSquare className="w-4 h-4" /> },
        { title: "Loyalty", icon: <Star className="w-4 h-4" /> },
        { title: "History", icon: <History className="w-4 h-4" /> },
      ],
    },
    {
      title: "Reports",
      key: "reports",
      icon: <BarChart className="w-5 h-5" />,
      flows: [
        { title: "Sales", icon: <BarChart className="w-4 h-4" /> },
        { title: "Top Products", icon: <BarChart className="w-4 h-4" /> },
        { title: "Revenue", icon: <BarChart className="w-4 h-4" /> },
        { title: "Cash Drawer", icon: <CreditCard className="w-4 h-4" /> },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      icon: <Settings className="w-5 h-5" />,
      flows: [
        { title: "Theme", icon: <Settings className="w-4 h-4" /> },
        { title: "Receipt", icon: <Printer className="w-4 h-4" /> },
        { title: "Tax/Currency", icon: <Key className="w-4 h-4" /> },
      ],
    },
  ];

  // simple slug helper for route building
  const slug = (s) =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 
          lg:static lg:left-auto lg:top-auto lg:translate-x-0 
          h-screen overflow-y-auto no-scrollbar 
          w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0
          bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          text-gray-200 border-r border-gray-700
          transition-all duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          ${variant === "v2" ? "border-r border-gray-700" : "shadow-lg"}`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between mb-6 px-2 sticky top-0 bg-gray-900/90 backdrop-blur-sm z-10 py-3 rounded-md">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent lg:hidden lg:sidebar-expanded:block 2xl:block">
            POS
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

        {/* Links */}
        <div className="space-y-4 px-1">
          <h3 className="text-xs uppercase text-gray-400 font-semibold pl-3">
            Modules
          </h3>
          <ul className="mt-2">
            {modules.map((module) => {
              const isParentActive =
                pathname.startsWith(`/${module.key}`) ||
                module.flows.some((flow) =>
                  pathname.includes(
                    `/${module.key}/${slug(flow.title)}`
                  )
                );

              // build a default route (first flow) to navigate to when clicking parent
              const defaultFlowPath =
                module.flows && module.flows.length > 0
                  ? `/${module.key}/${slug(module.flows[0].title)}`
                  : `/${module.key}`;

              return (
                <SidebarLinkGroup
                  key={module.key}
                  activecondition={isParentActive}
                  initialOpen={isParentActive} // auto-expand if active
                >
                  {(handleClick, open) => (
                    <>
                      {/* Parent link — now navigates to default child route on click */}
                      <button
                        type="button"
                        onClick={() => {
                          // navigate to default child so active state moves
                          navigate(defaultFlowPath);
                          setSidebarExpanded(true);
                          // if mobile, close sidebar after navigation
                          if (sidebarOpen) setSidebarOpen(false);
                        }}
                        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-md border-l-4 transition ${
                          isParentActive
                            ? "bg-gray-800 text-blue-400 font-semibold border-blue-500"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/70 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-gray-400">{module.icon}</div>
                          <span className="text-sm font-medium lg:hidden lg:sidebar-expanded:inline 2xl:inline">
                            {module.title}
                          </span>
                        </div>
                        <svg
                          className={`w-3 h-3 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                        </svg>
                      </button>

                      {/* Sub-links */}
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul
                          className={`pl-8 mt-1 space-y-1 ${
                            !open && "hidden"
                          }`}
                        >
                          {module.flows.map((flow, i) => (
                            <li key={i}>
                              <NavLink
                                end
                                to={`/${module.key}/${slug(flow.title)}`}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-2 py-1 rounded-md text-sm border-l-4 transition ${
                                    isActive
                                      ? "text-blue-400 bg-gray-800 border-blue-500 font-medium"
                                      : "text-gray-500 hover:text-gray-200 hover:bg-gray-800/70 border-transparent"
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
