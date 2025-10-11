"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import storeData from "@/data/products.json";

export function PromotionalBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

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
            {storeData.siteSettings.promotionalMessage}
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
