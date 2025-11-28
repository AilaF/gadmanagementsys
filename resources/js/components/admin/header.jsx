import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, LogOut } from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";

const Header = () => {
  const page = usePage();
  const currentUrl = page?.url || (typeof window !== "undefined" && window.location.href) || "";
  const currentPath = (() => {
    try {
      return new URL(currentUrl, window.location.origin).pathname;
    } catch {
      return currentUrl;
    }
  })();

  const resolvePathname = (routeName, fallback) => {
    try {
      return new URL(route(routeName), window.location.origin).pathname;
    } catch {
      return fallback;
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    router.post(route("logout"));
  };

  
  //NOTIFICATIONS
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Get logged-in user from Laravel session
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/current-user");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  // Get notifications for this user
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `/notifications/${user.userID}/${user.role}`
      );
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await axios.post(`/notifications/${user.userID}/${user.role}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
///Notif-end
  
  
  return (
    <header className="flex justify-between items-center px-6 py-1.5 bg-white shadow-md rounded-lg h-16 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src="/img/logo.svg" className="w-14 h-14" alt="GAD Logo" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex justify-center">
        <ul className="flex gap-10 list-none">
          <li>
            {(() => {
              const path = resolvePathname("admin.home", "/admin");
              const active = path === currentPath;
              return (
                <Link
                  href={route("admin.home")}
                  className={
                    "border-b-2 transition-all duration-200 px-1 " +
                    (active
                      ? "text-[#8b5cf6] border-[#8b5cf6] font-semibold"
                      : "text-slate-600 border-transparent hover:text-[#8b5cf6] hover:border-[#8b5cf6]")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  Dashboard
                </Link>
              );
            })()}
          </li>
          <li>
            {(() => {
              const path = resolvePathname("admin.manageusers", "/admin/manage-users");
              const active = path === currentPath;
              return (
                <Link
                  href={route("admin.manageusers")}
                  className={
                    "border-b-2 transition-all duration-200 px-1 " +
                    (active
                      ? "text-[#8b5cf6] border-[#8b5cf6] font-semibold"
                      : "text-slate-600 border-transparent hover:text-[#8b5cf6] hover:border-[#8b5cf6]")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  Manage Users
                </Link>
              );
            })()}
          </li>
          <li>
            {(() => {
              const path = resolvePathname("admin.trackpaps", "/admin/track-paps");
              const active = path === currentPath;
              return (
                <Link
                  href={route("admin.trackpaps")}
                  className={
                    "border-b-2 transition-all duration-200 px-1 " +
                    (active
                      ? "text-[#8b5cf6] border-[#8b5cf6] font-semibold"
                      : "text-slate-600 border-transparent hover:text-[#8b5cf6] hover:border-[#8b5cf6]")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  Track PAPs
                </Link>
              );
            })()}
          </li>
          <li>
            {(() => {
              const path = resolvePathname("admin.scorecard", "/admin/scorecard");
              const active = path === currentPath;
              return (
                <Link
                  href={route("admin.scorecard")}
                  className={
                    "border-b-2 transition-all duration-200 px-1 " +
                    (active
                      ? "text-[#8b5cf6] border-[#8b5cf6] font-semibold"
                      : "text-slate-600 border-transparent hover:text-[#8b5cf6] hover:border-[#8b5cf6]")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  Scorecard
                </Link>
              );
            })()}
          </li>
          <li>
            {(() => {
              const path = resolvePathname("admin.reports", "/admin/reports");
              const active = path === currentPath;
              return (
                <Link
                  href={route("admin.reports")}
                  className={
                    "border-b-2 transition-all duration-200 px-1 " +
                    (active
                      ? "text-[#8b5cf6] border-[#8b5cf6] font-semibold"
                      : "text-slate-600 border-transparent hover:text-[#8b5cf6] hover:border-[#8b5cf6]")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  Reports
                </Link>
              );
            })()}
          </li>
        </ul>
      </nav>

      {/* Right Section (Admin + Icons) */}
      <div className="flex items-center gap-4">
        <span className="text-[#8b5cf6] font-medium">Admin</span>

{/* 🔔 Notifications */}
    <div className="relative">
      <button
        onClick={() => setShowList(!showList)}
        className="relative group flex items-center"
      >
        <Bell
          className="text-[#8b5cf6] cursor-pointer transition-transform duration-200 group-hover:scale-110"
          size={20}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showList && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h4 className="text-sm font-semibold text-gray-700">Notifications</h4>
            <button
              onClick={markAllAsRead}
              className="text-xs text-[#8b5cf6] hover:underline"
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <p className="text-center text-sm text-gray-500 py-4">Loading...</p>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.notifID}
                  className={`px-4 py-2 text-sm border-b hover:bg-gray-50 ${
                    notif.isRead ? "text-gray-500" : "text-gray-800 font-medium"
                  }`}
                >
                  {notif.message}
                  <div className="text-xs text-gray-400">
                    {new Date(notif.dateSent).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4">
                No notifications
              </p>
            )}
          </div>
        </div>
      )}
    </div>

        {/* Logout icon */}
        <button
          onClick={handleLogout}
          className="relative group text-[#8b5cf6] hover:text-[#7c3aed] transition flex items-center"
          title="Logout"
        >
          <LogOut
            size={20}
            className="relative top-[1px] transition-transform duration-200 group-hover:scale-110"
          />
          {/* Tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 text-xs text-white bg-black bg-opacity-90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Logout
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
