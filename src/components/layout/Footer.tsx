"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Sparkles,
  Twitter,
  Youtube,
  Linkedin,
  MessageSquare,
} from "lucide-react";

interface SiteSettings {
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
    pinterest?: string;
    snapchat?: string;
    whatsapp?: string;
    telegram?: string;
    discord?: string;
    reddit?: string;
    twitch?: string;
    vimeo?: string;
    behance?: string;
    dribbble?: string;
    github?: string;
    medium?: string;
    clubhouse?: string;
  };
  address?: string;
  phone?: string;
  email?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    socialMedia: {},
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch settings
        const settingsRes = await fetch("/api/settings");
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.settings) {
          setSiteSettings(settingsData.settings);
        }

        // Fetch categories
        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          // Filter out "all" category
          const filtered = categoriesData.categories.filter(
            (cat: Category) => cat.slug !== "all"
          );
          setCategories(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <footer className="bg-secondary/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 p-1 group-hover:scale-105 transition-all duration-300 ring-2 ring-primary/30">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900 p-1">
                  <Image
                    src="/logo.png"
                    alt="SherGill Official Logo"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
              </div>
              <span className="text-xl font-serif font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent tracking-wide group-hover:scale-105 transition-transform duration-300">
                SherGill Official
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Discover exquisite jewelry pieces that tell your unique story.
            </p>
            <div className="flex gap-3 flex-wrap">
              {siteSettings.socialMedia.facebook && (
                <a
                  href={siteSettings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-600/20 hover:bg-blue-600 text-blue-600 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialMedia.instagram && (
                <a
                  href={siteSettings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-pink-600/20 hover:bg-pink-600 text-pink-600 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialMedia.twitter && (
                <a
                  href={siteSettings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-sky-500/20 hover:bg-sky-500 text-sky-500 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialMedia.youtube && (
                <a
                  href={siteSettings.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-red-600/20 hover:bg-red-600 text-red-600 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialMedia.linkedin && (
                <a
                  href={siteSettings.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-700/20 hover:bg-blue-700 text-blue-700 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialMedia.whatsapp && (
                <a
                  href={`https://wa.me/${siteSettings.socialMedia.whatsapp.replace(
                    /[^\d]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-green-600/20 hover:bg-green-600 text-green-600 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialMedia.tiktok && (
                <a
                  href={siteSettings.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-black/20 hover:bg-black text-black hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.pinterest && (
                <a
                  href={siteSettings.socialMedia.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white transition-colors"
                  aria-label="Pinterest"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.telegram && (
                <a
                  href={siteSettings.socialMedia.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500 text-blue-500 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.discord && (
                <a
                  href={siteSettings.socialMedia.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-colors"
                  aria-label="Discord"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.reddit && (
                <a
                  href={siteSettings.socialMedia.reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-orange-600/20 hover:bg-orange-600 text-orange-600 hover:text-white transition-colors"
                  aria-label="Reddit"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.twitch && (
                <a
                  href={siteSettings.socialMedia.twitch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-600 text-purple-600 hover:text-white transition-colors"
                  aria-label="Twitch"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.vimeo && (
                <a
                  href={siteSettings.socialMedia.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-cyan-600/20 hover:bg-cyan-600 text-cyan-600 hover:text-white transition-colors"
                  aria-label="Vimeo"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.behance && (
                <a
                  href={siteSettings.socialMedia.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-800/20 hover:bg-blue-800 text-blue-800 hover:text-white transition-colors"
                  aria-label="Behance"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 7.5v9A1.5 1.5 0 0 0 1.5 18h21a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 22.5 6h-21A1.5 1.5 0 0 0 0 7.5zM6.75 9.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0zM18.75 12.75a3.75 3.75 0 0 0-7.5 0v1.5h7.5v-1.5zm-7.5-3a3.75 3.75 0 0 1 7.5 0v1.5h-7.5v-1.5zm7.5 6h-7.5v-1.5a3.75 3.75 0 0 1 7.5 0v1.5z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.dribbble && (
                <a
                  href={siteSettings.socialMedia.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-pink-500/20 hover:bg-pink-500 text-pink-500 hover:text-white transition-colors"
                  aria-label="Dribbble"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.433 0-.856.04-1.27.11zm14.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.48.47.985.68 1.49.08.19.15.38.22.57 3.247-1.23 6.6-1.065 6.83-1.055-.02-1.78-.58-3.36-1.606-4.645zm-5.177 7.308c-.2-.58-.39-1.16-.59-1.72-.66-.1-1.33-.17-2-.2.12.66.25 1.32.38 1.98.08.42.15.84.22 1.25.66.03 1.32.08 1.98.15-.04-.46-.09-.92-.15-1.38-.08-.42-.16-.84-.25-1.26-.66-.05-1.33-.08-1.99-.1.12.66.25 1.32.38 1.98.08.41.16.83.24 1.24.66.02 1.32.05 1.98.1.04-.46.09-.92.15-1.38.08-.41.16-.83.24-1.24z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.github && (
                <a
                  href={siteSettings.socialMedia.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800/20 hover:bg-gray-800 text-gray-800 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.medium && (
                <a
                  href={siteSettings.socialMedia.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-600/20 hover:bg-gray-600 text-gray-600 hover:text-white transition-colors"
                  aria-label="Medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75S24 8.83 24 12z" />
                  </svg>
                </a>
              )}
              {siteSettings.socialMedia.clubhouse && (
                <a
                  href={siteSettings.socialMedia.clubhouse}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-purple-700/20 hover:bg-purple-700 text-purple-700 hover:text-white transition-colors"
                  aria-label="Clubhouse"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.5 8.5c-.276 0-.5.224-.5.5v6c0 .276.224.5.5.5s.5-.224.5-.5V9c0-.276-.224-.5-.5-.5zM12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id || category._id}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact Us</h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">📞 Phone:</span>
                <a
                  href={`tel:${
                    siteSettings.phone ||
                    siteSettings.contactPhone ||
                    "+1234567890"
                  }`}
                  className="hover:text-primary transition-colors"
                >
                  {siteSettings.phone ||
                    siteSettings.contactPhone ||
                    "+1 (234) 567-890"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">✉️ Email:</span>
                <a
                  href={`mailto:${
                    siteSettings.email ||
                    siteSettings.contactEmail ||
                    "info@shergillofficial.com"
                  }`}
                  className="hover:text-primary transition-colors"
                >
                  {siteSettings.email ||
                    siteSettings.contactEmail ||
                    "info@shergillofficial.com"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">🕐 Hours:</span>
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
              {siteSettings.address && (
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">
                    📍 Address:
                  </span>
                  <span>{siteSettings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} SherGill Official. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
