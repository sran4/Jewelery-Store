"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/admin/PasswordStrength";
import { Lock, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/admin/login";
    },
  });

  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Change Password
          </h1>
          <p className="text-muted-foreground mt-2">
            Update your admin password to keep your account secure
          </p>
        </div>

        {/* Change Password Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  required
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter your existing password to verify it's you
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                  required
                  className="pl-10 pr-10"
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <PasswordStrength password={formData.newPassword} />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  required
                  className="pl-10 pr-10"
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <p
                  className={`text-xs mt-2 ${
                    formData.newPassword === formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.newPassword === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-secondary/50 border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-3">
                🔒 Password Requirements:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span
                    className={
                      formData.newPassword.length >= 8
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    {formData.newPassword.length >= 8 ? "✓" : "•"}
                  </span>
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className={
                      formData.newPassword !== formData.currentPassword &&
                      formData.newPassword.length > 0
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    {formData.newPassword !== formData.currentPassword &&
                    formData.newPassword.length > 0
                      ? "✓"
                      : "•"}
                  </span>
                  <span>Different from current password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className={
                      formData.newPassword === formData.confirmPassword &&
                      formData.confirmPassword.length > 0
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    {formData.newPassword === formData.confirmPassword &&
                    formData.confirmPassword.length > 0
                      ? "✓"
                      : "•"}
                  </span>
                  <span>Passwords match</span>
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={
                  loading ||
                  formData.newPassword !== formData.confirmPassword ||
                  formData.newPassword.length < 8
                }
                className="flex-1"
              >
                {loading ? "Changing Password..." : "Change Password"}
              </Button>
              <Link href="/admin">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Security Tips
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use a strong, unique password</li>
            <li>• Don't share your password with anyone</li>
            <li>• Change your password regularly</li>
            <li>• Use a password manager for better security</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
