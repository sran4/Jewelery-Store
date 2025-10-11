"use client";

import { Product } from "@/types";
import { Facebook, Link as LinkIcon, Twitter } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  product: Product;
}

export function ShareButtons({ product }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${product.title} - ${product.description.slice(
    0,
    100
  )}...`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToPinterest = () => {
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      shareUrl
    )}&media=${encodeURIComponent(
      product.images[0]
    )}&description=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">Share:</span>
      <div className="flex gap-2">
        <button
          onClick={shareToFacebook}
          className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        <button
          onClick={shareToTwitter}
          className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        <button
          onClick={shareToPinterest}
          className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Share on Pinterest"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.89-.19-2.28.04-3.26l1.45-6.17s-.37-.74-.37-1.83c0-1.71 1-2.99 2.24-2.99 1.05 0 1.56.79 1.56 1.74 0 1.06-.68 2.64-.97 4.1-.28 1.17.59 2.12 1.75 2.12 2.1 0 3.72-2.21 3.72-5.4 0-2.82-2.03-4.79-4.93-4.79-3.36 0-5.33 2.52-5.33 5.12 0 1.02.39 2.11.88 2.7.1.12.11.22.08.35-.09.38-.29 1.16-.33 1.32-.05.22-.17.27-.4.16-1.49-.69-2.42-2.87-2.42-4.62 0-3.76 2.73-7.21 7.88-7.21 4.13 0 7.35 2.94 7.35 6.87 0 4.1-2.59 7.4-6.18 7.4-1.21 0-2.35-.63-2.74-1.37l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14A12 12 0 1 0 12 0z" />
          </svg>
        </button>
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors relative"
          aria-label="Copy link"
        >
          <LinkIcon className="w-4 h-4" />
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
