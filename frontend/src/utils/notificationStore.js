// notificationStore.js - Notification state management

let listeners = [];
let notifications = [];

// Load notifications from localStorage
function loadNotifications() {
  try {
    const stored = localStorage.getItem("notifications");
    notifications = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load notifications:", e);
    notifications = [];
  }
}

// Save notifications to localStorage
function saveNotifications() {
  try {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  } catch (e) {
    console.error("Failed to save notifications:", e);
  }
}

export const notificationStore = {
  // Add listener for state changes
  subscribe: (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  // Notify all listeners of changes
  notify: () => {
    listeners.forEach(listener => listener());
  },

  // Get all notifications
  getAll: () => {
    loadNotifications();
    return notifications;
  },

  // Get unread notification count
  getUnreadCount: () => {
    loadNotifications();
    return notifications.filter(n => !n.read).length;
  },

  // Add new notification
  add: (notification) => {
    loadNotifications();
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    notifications.unshift(newNotification);
    saveNotifications();
    notificationStore.notify();
    return newNotification;
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    loadNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      saveNotifications();
      notificationStore.notify();
    }
  },

  // Mark all as read
  markAllAsRead: () => {
    loadNotifications();
    notifications.forEach(n => n.read = true);
    saveNotifications();
    notificationStore.notify();
  },

  // Clear all notifications
  clearAll: () => {
    notifications = [];
    saveNotifications();
    notificationStore.notify();
  },

  // Remove specific notification
  remove: (notificationId) => {
    loadNotifications();
    notifications = notifications.filter(n => n.id !== notificationId);
    saveNotifications();
    notificationStore.notify();
  },

  // Add student-specific notifications
  notifyQuizStartingSoon: (quizTitle) => {
    notificationStore.add({
      type: "quiz_starting",
      title: "Quiz Starting Soon",
      message: `${quizTitle} is starting now!`,
      icon: "🚀",
      color: "#f97316",
    });
  },

  notifyQuizLive: (quizTitle) => {
    notificationStore.add({
      type: "quiz_live",
      title: "Quiz Live",
      message: `${quizTitle} is now available. Start attempting!`,
      icon: "🔴",
      color: "#dc2626",
    });
  },

  notifyQuizEnded: (quizTitle) => {
    notificationStore.add({
      type: "quiz_ended",
      title: "Quiz Ended",
      message: `${quizTitle} has ended.`,
      icon: "⏱️",
      color: "#7c3aed",
    });
  },

  notifyResultsAvailable: (quizTitle) => {
    notificationStore.add({
      type: "results_available",
      title: "Results Available",
      message: `Results for ${quizTitle} are now available!`,
      icon: "📊",
      color: "#2563eb",
    });
  },

  // Add examiner-specific notifications
  notifyNewAttempt: (candidateName, quizTitle) => {
    notificationStore.add({
      type: "new_attempt",
      title: "New Attempt",
      message: `${candidateName} attempted ${quizTitle}`,
      icon: "📝",
      color: "#16a34a",
    });
  },

  notifyQuizStartedExaminer: (quizTitle) => {
    notificationStore.add({
      type: "quiz_started_examiner",
      title: "Quiz Started",
      message: `${quizTitle} is now live!`,
      icon: "🔴",
      color: "#dc2626",
    });
  },

  notifyQuizEndedExaminer: (quizTitle) => {
    notificationStore.add({
      type: "quiz_ended_examiner",
      title: "Quiz Ended",
      message: `${quizTitle} has ended.`,
      icon: "⏱️",
      color: "#7c3aed",
    });
  },

  notifyQuizCreated: (quizTitle) => {
    notificationStore.add({
      type: "quiz_created",
      title: "Quiz Created",
      message: `${quizTitle} has been created successfully!`,
      icon: "✨",
      color: "#2563eb",
    });
  },
};
