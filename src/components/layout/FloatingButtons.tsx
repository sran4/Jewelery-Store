"use client";

import { useState, useEffect } from "react";
import { Phone, MessageSquare, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { Modal } from "@/components/ui/Modal";
import { ContactForm } from "@/components/contact/ContactForm";
import { formatPhoneNumber, getCleanPhoneNumber, formatWhatsAppNumber } from "@/lib/formatPhone";

interface SiteSettings {
  contactPhone?: string;
  whatsapp?: string;
}

export function FloatingButtons() {
  const { isScrolled } = useScrollPosition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [copiedButton, setCopiedButton] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect if touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSiteSettings(data.settings);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    }
    fetchSettings();
  }, []);

  const handlePhoneClick = async (e: React.MouseEvent) => {
    // On desktop (non-touch), copy to clipboard
    if (!isTouchDevice) {
      e.preventDefault();
      const cleanNumber = getCleanPhoneNumber(siteSettings.contactPhone);
      if (cleanNumber) {
        try {
          await navigator.clipboard.writeText(cleanNumber);
          setCopiedButton('phone');
          setTimeout(() => setCopiedButton(null), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
    }
    // On mobile, let the tel: link work naturally
  };

  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    // WhatsApp always opens, but on desktop we can show copied feedback too
    if (!isTouchDevice) {
      const cleanNumber = formatWhatsAppNumber(siteSettings.whatsapp);
      if (cleanNumber) {
        try {
          await navigator.clipboard.writeText(cleanNumber);
          setCopiedButton('whatsapp');
          setTimeout(() => setCopiedButton(null), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-6 bottom-6 z-30 flex flex-col gap-3"
          >
            {/* Phone Button */}
            <div className="relative">
              <motion.a
                href={`tel:${getCleanPhoneNumber(siteSettings.contactPhone)}`}
                onClick={handlePhoneClick}
                onMouseEnter={() => !isTouchDevice && setHoveredButton('phone')}
                onMouseLeave={() => !isTouchDevice && setHoveredButton(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all float-animation relative"
                aria-label="Call us"
              >
                {copiedButton === 'phone' ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Phone className="w-6 h-6" />
                )}
              </motion.a>
              
              {/* Tooltip for Desktop */}
              <AnimatePresence>
                {!isTouchDevice && hoveredButton === 'phone' && siteSettings.contactPhone && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap"
                  >
                    <div className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-xl border border-gray-700/50">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">
                          {copiedButton === 'phone' ? 'Copied!' : formatPhoneNumber(siteSettings.contactPhone)}
                        </span>
                      </div>
                      {copiedButton !== 'phone' && (
                        <div className="text-xs text-gray-400 mt-1">
                          Click to copy
                        </div>
                      )}
                    </div>
                    {/* Arrow */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900/95 dark:border-l-gray-800/95"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WhatsApp Button */}
            <div className="relative">
              <motion.a
                href={`https://wa.me/${formatWhatsAppNumber(siteSettings.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                onMouseEnter={() => !isTouchDevice && setHoveredButton('whatsapp')}
                onMouseLeave={() => !isTouchDevice && setHoveredButton(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all relative"
                aria-label="WhatsApp"
                style={{ animationDelay: "0.5s" }}
              >
                {copiedButton === 'whatsapp' ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                )}
              </motion.a>
              
              {/* Tooltip for Desktop */}
              <AnimatePresence>
                {!isTouchDevice && hoveredButton === 'whatsapp' && siteSettings.whatsapp && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap"
                  >
                    <div className="bg-[#25D366]/95 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-xl border border-[#20BA5A]/50">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span className="font-medium">
                          {copiedButton === 'whatsapp' ? 'Copied!' : formatPhoneNumber(siteSettings.whatsapp)}
                        </span>
                      </div>
                      {copiedButton !== 'whatsapp' && (
                        <div className="text-xs text-green-100 mt-1">
                          Click to open WhatsApp
                        </div>
                      )}
                    </div>
                    {/* Arrow */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#25D366]/95"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Form Button */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all relative"
              aria-label="Contact form"
              title="Send us a message"
              style={{ animationDelay: "1s" }}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Get in Touch"
        size="lg"
      >
        <ContactForm isModal onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
