"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-500/25 via-yellow-500/25 to-amber-600/25 p-1 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-600/50 transition-all duration-300 ring-2 ring-amber-600/50 group-hover:ring-amber-600/70">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Shergill Official Logo"
                  fill
                  className="object-cover scale-110"
                  priority
                />
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:via-amber-400 group-hover:to-yellow-500 group-hover:scale-105 transition-all duration-300 tracking-wide">
              Shergill Official
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
