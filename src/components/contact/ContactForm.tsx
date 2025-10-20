"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { INQUIRY_TYPES } from "@/lib/constants";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { motion } from "framer-motion";

interface ContactFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
}

export function ContactForm({ isModal = false, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [messageError, setMessageError] = useState("");

  const MIN_MESSAGE_LENGTH = 10;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (name === "message") {
      setMessageError("");
    }
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const validateMessage = (): boolean => {
    if (!formData.message.trim()) {
      setMessageError("Message is required");
      return false;
    }

    if (formData.message.trim().length < MIN_MESSAGE_LENGTH) {
      setMessageError(
        `Message must be at least ${MIN_MESSAGE_LENGTH} characters long (currently ${
          formData.message.trim().length
        } characters)`
      );
      return false;
    }

    setMessageError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate message before submitting
    if (!validateMessage()) {
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      // Use your own backend API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiryType: formData.inquiryType,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiryType: "General Inquiry",
          message: "",
        });
        setMessageError("");
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setStatus("error");
        setErrorMessage(
          result.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo & Brand Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-500/25 via-yellow-500/25 to-amber-600/25 p-1 ring-2 ring-amber-600/50 shadow-lg"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Shergill Official Logo"
                width={64}
                height={64}
                className="object-cover scale-110"
                priority
              />
            </div>
          </motion.div>
        </div>
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent"
        >
          Shergill Official
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1">
          We'd love to hear from you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+1 (234) 567-8900"
          />
          <Select
            label="Inquiry Type"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            options={INQUIRY_TYPES.map((type) => ({
              value: type,
              label: type,
            }))}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-foreground">
              Message
            </label>
            <span
              className={`text-xs ${
                formData.message.trim().length < MIN_MESSAGE_LENGTH
                  ? "text-muted-foreground"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {formData.message.trim().length}/{MIN_MESSAGE_LENGTH} characters
            </span>
          </div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={isModal ? 4 : 6}
            placeholder="Tell us about your inquiry... (minimum 10 characters)"
            className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
              messageError
                ? "border-red-500 focus:ring-red-500"
                : "border-input focus:ring-primary"
            }`}
          />
          {messageError && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {messageError}
            </p>
          )}
        </div>

        {status === "success" && (
          <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-600 dark:text-green-400">
            Thank you! Your message has been sent successfully. We'll get back
            to you soon!
          </div>
        )}

        {status === "error" && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-600 dark:text-red-400 flex items-start gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Oops! Something went wrong</p>
              <p className="text-sm mt-1">
                {errorMessage || "Please try again or contact us directly."}
              </p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
}
