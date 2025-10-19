"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { INQUIRY_TYPES } from "@/lib/constants";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

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
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          options={INQUIRY_TYPES.map((type) => ({ value: type, label: type }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={isModal ? 4 : 6}
          placeholder="Tell us about your inquiry..."
          className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
        />
      </div>

      {status === "success" && (
        <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-600 dark:text-green-400">
          Thank you! Your message has been sent successfully. We'll get back to
          you soon!
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-600 dark:text-red-400">
          Oops! Something went wrong. Please try again or contact us directly.
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
  );
}
