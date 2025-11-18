import React, { useState } from "react";
import { Database, Store, ShoppingCart, Users, Truck } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Header from "../partials/Header";

function Menu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const modules = [
    { title: "ERP", description: "Manage products, users, roles, inventory & reports.", icon: Database, link: "/erp-login", available: true },
    { title: "POS", description: "Cashier system for in-store sales & payments.", icon: Store, link: "/pos-login", available: true },
    { title: "Warehouse", description: "Receive goods, stock counts, and manage adjustments.", icon: ShoppingCart, link: "/warehouse", available: false },
    { title: "E-commerce", description: "Customer portal for browsing and placing online orders.", icon: Users, link: "/ecommerce", available: false },
    { title: "Driver", description: "Delivery app for drivers to manage assigned orders.", icon: Truck, link: "/driver", available: false },
  ];

  const handleModuleClick = (mod) => {
    if (!mod.available) {
      Swal.fire({
        title: "Coming Soon",
        text: `${mod.title} module is under development!`,
        icon: "info",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = mod.link;
    }, 800);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <motion.div
            className="h-16 w-16 border-4 border-t-indigo-600 border-b-indigo-400 rounded-full"
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
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/banner1.jpg')" }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="relative z-10 px-4 sm:px-6 lg:px-12 py-12 max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">Select a Module</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((mod) => (
                <motion.button
                  key={mod.title}
                  onClick={() => handleModuleClick(mod)}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-white/90 rounded-xl shadow-md hover:shadow-xl transition duration-300"
                >
                  <div className="p-3 bg-gray-200 rounded-full flex items-center justify-center">
                    <mod.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-semibold text-gray-800">{mod.title}</h2>
                    <p className="text-gray-600 text-sm">{mod.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Menu;
