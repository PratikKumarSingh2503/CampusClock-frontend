import { createContext, useState, useContext, useEffect } from "react";
import API from "../utils/api";
import { toast } from "react-hot-toast";
import { useUser } from "./UserContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();

  // Check for due reminders periodically only when user is logged in
  useEffect(() => {
    let interval;
    if (user && localStorage.getItem("token")) {
      checkDueReminders();
      interval = setInterval(checkDueReminders, 60000); // Check every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]); // Add user as dependency

  const checkDueReminders = async () => {
    try {
      // Check if token exists before making the request
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token available, skipping reminder check");
        return;
      }

      const res = await API.get("/reminders/due");
      if (res.data && res.data.length > 0) {
        // Add new notifications to the list
        const newNotifications = res.data.map(reminder => ({
          id: reminder.id,
          title: reminder.title,
          description: reminder.description,
          time: new Date(reminder.dateTime),
          color: reminder.color,
          priority: reminder.priority,
          type: "reminder",
          read: false
        }));

        setNotifications(prev => [...newNotifications, ...prev].slice(0, 50)); // Keep last 50 notifications
        setUnreadCount(prev => prev + newNotifications.length);

        // Show toast for each new reminder
        newNotifications.forEach(notification => {
          toast(notification.title, {
            icon: "🔔",
            duration: 5000,
            style: {
              background: notification.color,
              color: "white"
            }
          });
        });
      }
    } catch (err) {
      console.error("Error checking due reminders:", err);
      // If unauthorized, clear notifications
      if (err.response?.status === 401) {
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
