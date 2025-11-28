import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

type NotificationItem = {
  notifID: string | number;
  message: string;
  isRead: boolean;
  relatedPapsID?: string | number | null;
};

type Props = {
  recipientID: string | number;
  recipientType: string;
};

export default function NotificationBell({ recipientID, recipientType }: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<NotificationItem[]>(
        `/notifications/${recipientID}/${recipientType}`,
        { signal }
      );
      setNotifications(response.data || []);
    } catch (err: any) {
      // If request was aborted, don't set error
      if (err?.name === "CanceledError" || err?.message === "canceled") {
        return;
      }
      console.error("Error fetching notifications", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [recipientID, recipientType]);

  // Fetch on mount and when recipient changes
  useEffect(() => {
    const controller = new AbortController();
    fetchNotifications(controller.signal);
    return () => controller.abort();
  }, [fetchNotifications]);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowList(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const markAllAsRead = async () => {
    const hasUnread = notifications.some((n) => !n.isRead);
    if (!hasUnread) return;

    // optimistic update
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await axios.post(`/notifications/${recipientID}/${recipientType}/read-all`);
    } catch (err) {
      console.error("Failed to mark as read", err);
      // rollback
      setNotifications(previous);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-haspopup="true"
        aria-expanded={showList}
        aria-label="Notifications"
        onClick={() => {
          // when opening, refresh to get latest
          const next = !showList;
          setShowList(next);
          if (next) {
            const controller = new AbortController();
            fetchNotifications(controller.signal);
          }
        }}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {showList && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-xl border border-gray-200 z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Notifications</h2>
            <button
              onClick={markAllAsRead}
              disabled={loading || unreadCount === 0}
              className={`text-sm text-indigo-600 hover:underline ${
                loading || unreadCount === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              Mark all as read
            </button>
          </div>

          <ul className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <li className="p-4 text-center text-gray-500">Loading...</li>
            ) : error ? (
              <li className="p-4 text-center text-red-500">{error}</li>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <li
                  key={n.notifID}
                  className={`px-4 py-3 border-b last:border-none ${
                    n.isRead ? "bg-gray-50" : "bg-purple-50"
                  }`}
                >
                  <p className="text-sm text-gray-800">{n.message}</p>
                  {n.relatedPapsID && (
                    <a
                      href={`/paps/${n.relatedPapsID}`}
                      className="text-sm text-indigo-600 hover:underline block mt-1"
                    >
                      View
                    </a>
                  )}
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
