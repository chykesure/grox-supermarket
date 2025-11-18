import React, { useState } from "react";
import { Database, ShoppingCart, Truck, Store, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // <-- import motion for spinner
import Header from "../partials/Header";
import Banner from "../partials/Banner";

function Menu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // <-- loading state

  const modules = [
    {
      title: "ERP",
      description: "Manage products, users, roles, inventory & reports.",
      icon: Database,
      link: "/erp-login",
      gradient: "from-indigo-500 to-indigo-700",
      button: "text-indigo-700",
    },
    {
      title: "POS",
      description: "Cashier system for in-store sales & payments.",
      icon: Store,
      link: "/pos-login",
      gradient: "from-green-500 to-green-700",
      button: "text-green-700",
    },
    {
      title: "Warehouse",
      description: "Receive goods, stock counts, and manage adjustments.",
      icon: ShoppingCart,
      link: "/warehouse",
      gradient: "from-orange-500 to-orange-700",
      button: "text-orange-700",
    },
    {
      title: "E-commerce",
      description: "Customer portal for browsing and placing online orders.",
      icon: Users,
      link: "/ecommerce",
      gradient: "from-blue-500 to-blue-700",
      button: "text-blue-700",
    },
    {
      title: "Driver",
      description: "Delivery app for drivers to manage assigned orders.",
      icon: Truck,
      link: "/driver",
      gradient: "from-pink-500 to-pink-700",
      button: "text-pink-700",
    },
  ];

  // Example: simulate loading when clicking a module
  const handleModuleClick = (link) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = link; // navigate after loading
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay with Spinner */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
          <motion.div
            className="h-16 w-16 border-4 border-t-blue-800 border-b-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p className="mt-4 text-gray-700 font-medium text-lg animate-pulse text-center">
            Loading, please wait...
          </p>
        </div>
      )}

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/banner1.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-55">
              {modules.map((mod) => (
                <div
                  key={mod.title}
                  className={`rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between 
                    bg-gradient-to-r ${mod.gradient} text-white 
                    hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-white/20 rounded-full mb-4 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                      <mod.icon className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">{mod.title}</h2>
                    <p className="text-sm sm:text-base opacity-90">{mod.description}</p>
                  </div>

                  {/* Button triggers loading overlay */}
                  <button
                    onClick={() => handleModuleClick(mod.link)}
                    className="mt-6 inline-block text-center bg-white font-medium 
                      text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <span className={mod.button}>Go to {mod.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>

        
      </div>
    </div>
  );
}

export default Menu;
