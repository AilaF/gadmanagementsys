import React from "react";
import { User, Bell } from "lucide-react";
import { usePage, router } from "@inertiajs/react";

export default function Header({ onProfileClick }) {
  const { auth } = usePage().props;

  const handleLogout = (e) => {
    e?.preventDefault?.();
    router.post(route("logout"));
  };

  const handleProfile = (e) => {
    e?.preventDefault?.();
    if (typeof onProfileClick === "function") {
      onProfileClick();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/img/logo.svg" className="w-20 h-20" alt="GAD Logo" />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Notifications"
          >
            <Bell size={20} />
          </button>

          <button
            type="button"
            onClick={handleProfile}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Profile"
          >
            <User size={20} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}