"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

export function Notification({
  type,
  title,
  message,
  duration = 4000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-600" />,
    error: <XCircle className="w-6 h-6 text-red-600" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />,
  };

  const colors = {
    success:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    error:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
    warning:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full mx-4 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${colors[type]}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              {message && <p className="text-sm opacity-90">{message}</p>}
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Notification hook for easy usage
export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (
    notification: Omit<NotificationProps, "onClose">
  ) => {
    const id = Date.now().toString();
    const newNotification: NotificationProps = {
      ...notification,
      onClose: () => removeNotification(id),
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const success = (title: string, message?: string) => {
    addNotification({ type: "success", title, message });
  };

  const error = (title: string, message?: string) => {
    addNotification({ type: "error", title, message });
  };

  const warning = (title: string, message?: string) => {
    addNotification({ type: "warning", title, message });
  };

  const info = (title: string, message?: string) => {
    addNotification({ type: "info", title, message });
  };

  return {
    notifications,
    success,
    error,
    warning,
    info,
  };
}

// Notification container component
export function NotificationContainer() {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <Notification key={index} {...notification} />
      ))}
    </div>
  );
}
