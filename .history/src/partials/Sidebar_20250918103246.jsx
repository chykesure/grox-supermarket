import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
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

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const modules = [
    {
      title: "Users",
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
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } ${variant === "v2" ? "border-r border-gray-200 dark:border-gray-700/60" : "rounded-r-2xl shadow-xs"}`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">POS Modules</span>
            </h3>
            <ul className="mt-3">
              {modules.map((module) => (
                <SidebarLinkGroup key={module.key} activecondition={pathname.includes(module.key)}>
                  {(handleClick, open) => (
                    <>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                          pathname.includes(module.key) ? "" : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="shrink-0 text-gray-500 dark:text-gray-400">{module.icon}</div>
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              {module.title}
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          {module.flows.map((flow, i) => (
                            <li key={i} className="mb-1 last:mb-0 flex items-center gap-2">
                              <NavLink
                                end
                                to={`/${module.key}/${flow.title.replace(/\s+/g, "-").toLowerCase()}`}
                                className={({ isActive }) =>
                                  "block transition duration-150 truncate " +
                                  (isActive
                                    ? "text-violet-500"
                                    : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                }
                              >
                                <div className="flex items-center gap-2">
                                  {flow.icon}
                                  <span className="text-sm font-medium">{flow.title}</span>
                                </div>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;