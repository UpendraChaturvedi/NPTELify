// NotificationCenter.jsx - Notification bell and dropdown

import { useState, useEffect } from "react";
import { notificationStore } from "../utils/notificationStore";

const C = {
  navy:"#1a3a6b",blue:"#2563eb",orange:"#f97316",green:"#16a34a",red:"#dc2626",purple:"#7c3aed",
  bg:"#f5f8ff",card:"#ffffff",altBg:"#eaf0fb",border:"#dce8fb",muted:"#7a8faf",body:"#4a6490",
};

// Add keyframe animation for pulsing notification badge
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse-badge {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  @keyframes bell-ring {
    0%, 100% { transform: rotate(0deg); }
    10% { transform: rotate(-10deg); }
    20% { transform: rotate(10deg); }
    30% { transform: rotate(-10deg); }
    40% { transform: rotate(10deg); }
    50% { transform: rotate(0deg); }
  }
  .notification-badge-pulse {
    animation: pulse-badge 2s ease-in-out infinite;
  }
  .notification-bell-ring {
    animation: bell-ring 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Ring bell when new unread notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setIsRinging(true);
      const timer = setTimeout(() => setIsRinging(false), 500);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Subscribe to notification changes
  useEffect(() => {
    const unsubscribe = notificationStore.subscribe(() => {
      setNotifications(notificationStore.getAll());
    });
    // Load initial notifications
    setNotifications(notificationStore.getAll());
    return unsubscribe;
  }, []);

  const handleMarkAsRead = (notificationId) => {
    notificationStore.markAsRead(notificationId);
  };

  const handleRemove = (notificationId) => {
    notificationStore.remove(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationStore.markAllAsRead();
  };

  const handleClearAll = () => {
    notificationStore.clearAll();
  };

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {/* Professional Bell Icon Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: open ? `linear-gradient(135deg, ${C.blue}, ${C.blue}dd)` : `linear-gradient(135deg, ${C.altBg}, ${C.bg})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: `2px solid ${open ? C.blue : C.border}`,
          fontSize: 20,
          fontWeight: 700,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          boxShadow: open 
            ? `0 4px 12px ${C.blue}33, inset 0 1px 0 rgba(255,255,255,0.2)` 
            : `0 2px 8px rgba(0, 0, 0, 0.08)`,
        }}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.boxShadow = `0 4px 16px ${C.blue}26, inset 0 1px 0 rgba(255,255,255,0.2)`;
            e.currentTarget.style.transform = "scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.boxShadow = `0 2px 8px rgba(0, 0, 0, 0.08)`;
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        {/* Custom SVG Bell Icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={open ? "white" : C.blue}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: isRinging && unreadCount > 0 ? "bell-ring 0.5s ease-in-out" : "none",
            transformOrigin: "center top",
          }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Enhanced Unread Badge */}
        {unreadCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.red}, #ff4444)`,
              border: `3px solid ${C.card}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 900,
              color: "white",
              boxShadow: `0 2px 8px ${C.red}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
              animation: "pulse-badge 2s ease-in-out infinite",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 0,
            width: 400,
            maxHeight: 520,
            borderRadius: 14,
            background: C.card,
            border: `1px solid ${C.border}`,
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.04)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Header - Enhanced Design */}
          <div
            style={{
              padding: "16px 20px",
              background: `linear-gradient(135deg, ${C.navy}06, ${C.blue}03)`,
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: unreadCount > 0 ? C.red : C.green,
              }}/>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>
                Notifications
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                background: C.altBg,
                padding: "2px 8px",
                borderRadius: 12,
              }}>
                {notifications.length}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.blue,
                    background: `${C.blue}08`,
                    border: `1px solid ${C.blue}20`,
                    cursor: "pointer",
                    padding: "4px 10px",
                    borderRadius: 6,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${C.blue}15`;
                    e.currentTarget.style.borderColor = `${C.blue}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${C.blue}08`;
                    e.currentTarget.style.borderColor = `${C.blue}20`;
                  }}
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.red,
                    background: `${C.red}08`,
                    border: `1px solid ${C.red}20`,
                    cursor: "pointer",
                    padding: "4px 10px",
                    borderRadius: 6,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${C.red}15`;
                    e.currentTarget.style.borderColor = `${C.red}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${C.red}08`;
                    e.currentTarget.style.borderColor = `${C.red}20`;
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ overflowY: "auto", flex: 1, maxHeight: 420 }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: C.muted,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => {
                const date = new Date(notif.timestamp);
                const timeStr =
                  date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }) +
                  " " +
                  date.toLocaleDateString("en-IN", {
                    month: "short",
                    day: "2-digit",
                  });

                return (
                  <div
                    key={notif.id}
                    onClick={() =>
                      !notif.read && handleMarkAsRead(notif.id)
                    }
                    style={{
                      padding: "14px 16px",
                      borderBottom: `1px solid ${C.border}`,
                      background: notif.read ? C.card : C.altBg,
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      borderLeft: `4px solid ${notif.read ? "transparent" : C.blue}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.bg;
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notif.read
                        ? C.card
                        : C.altBg;
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {/* Icon - Enhanced with background */}
                    <div
                      style={{
                        fontSize: 24,
                        flexShrink: 0,
                        marginTop: 2,
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        background: `${C.blue}08`,
                      }}
                    >
                      {notif.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.navy,
                          marginBottom: 3,
                        }}
                      >
                        {notif.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.body,
                          marginBottom: 5,
                          lineHeight: "1.4",
                        }}
                      >
                        {notif.message}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.muted,
                          fontWeight: 500,
                        }}
                      >
                        {timeStr}
                      </div>
                    </div>

                    {/* Unread indicator and close button */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        flexShrink: 0,
                        alignItems: "center",
                      }}
                    >
                      {!notif.read && (
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: C.blue,
                            boxShadow: `0 0 6px ${C.blue}66`,
                            animation: "pulse-badge 2s ease-in-out infinite",
                          }}
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(notif.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: C.muted,
                          cursor: "pointer",
                          fontSize: 16,
                          padding: "4px",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = C.red;
                          e.currentTarget.style.background = `${C.red}08`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = C.muted;
                          e.currentTarget.style.background = "none";
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
}
