// src/pages/pos/login.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "../../partials/Header";
import Banner from "../../partials/Banner";

function LoginPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        emailOrUsername,
        password,
      });

      const { token, user } = res.data;

      // Save token and user info
      localStorage.setItem("authToken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      // SweetAlert success
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${user.username}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow relative flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
            style={{ backgroundImage: "url('/banner1.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md p-10 bg-gradient-to-br from-orange-400 via-green-400 to-green-600 backdrop-blur-sm rounded-3xl shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-white">
              POS Login
            </h2>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="flex flex-col">
                <label className="mb-2 text-white font-medium">
                  Username / Email
                </label>
                <input
                  type="text"
                  placeholder="Enter your username or email"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl border border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 transition bg-white/20 text-white placeholder-white/70"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-white font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl border border-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition bg-white/20 text-white placeholder-white/70"
                />
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className={`mt-2 px-6 py-3 rounded-xl text-white font-semibold transition-all bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 flex items-center justify-center gap-2 ${
                  loading ? "cursor-not-allowed opacity-80" : ""
                }`}
                disabled={loading}
              >
                {loading && (
                  <motion.span
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                )}
                {loading ? "Logging in..." : "Login"}
              </motion.button>
            </form>
          </motion.div>
        </main>

        <Banner />
      </div>
    </div>
  );
}

export default LoginPage;
