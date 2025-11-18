// src/components/DropdownProfile.jsx
import React, { useState, useEffect } from "react";

function UserMenu({ align = "right" }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
        <span className="font-semibold text-gray-900 dark:text-gray-100">{username}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{role}</span>
      </button>

      {/* Dropdown content here, if needed */}
    </div>
  );
}

export default UserMenu;
