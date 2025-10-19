"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromotionalSettings {
  isActive: boolean;
  message: string;
  showTimer: boolean;
  timerMessage: string;
  saleEndDate?: string;
}

export function PromotionalBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [promotionalSettings, setPromotionalSettings] =
    useState<PromotionalSettings>({
      isActive: true,
      message: "🎉 Welcome to Shergill Official!",
      showTimer: false,
      timerMessage: "🔥 Sale ends in:",
      saleEndDate: undefined,
    });
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings?.promotionalSettings) {
          setPromotionalSettings(data.settings.promotionalSettings);
        }
      } catch (error) {
        console.error("Failed to fetch promotional settings:", error);
      }
    }
    fetchSettings();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (!promotionalSettings.showTimer || !promotionalSettings.saleEndDate) {
      setTimeLeft(null);
      return;
    }

    const saleEndDate = new Date(promotionalSettings.saleEndDate);
    const now = new Date();

    if (saleEndDate <= now) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const timeDiff = saleEndDate.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [promotionalSettings.showTimer, promotionalSettings.saleEndDate]);

  // Don't show if promotional bar is disabled
  if (!promotionalSettings.isActive || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 overflow-hidden"
      >
        <div className="container mx-auto flex items-center justify-center gap-4">
          <p className="text-sm md:text-base font-medium text-center">
            {promotionalSettings.showTimer && timeLeft ? (
              <span>
                {promotionalSettings.timerMessage} {timeLeft.days}d{" "}
                {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </span>
            ) : (
              <span>{promotionalSettings.message}</span>
            )}
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close promotional bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
