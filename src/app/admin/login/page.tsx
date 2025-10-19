"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      setError("Google login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 via-accent/30 to-primary/30 p-1 ring-4 ring-primary/50 shadow-2xl"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900 p-1">
                  <Image
                    src="/logo.png"
                    alt="SherGill Official Logo"
                    width={96}
                    height={96}
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                SherGill Official
              </h1>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Admin Portal
              </h2>
              <p className="text-blue-200 text-sm flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Secure Access
              </p>
            </motion.div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="admin@luxuryjewelry.com"
                required
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="w-4 h-4 rounded border-white/20"
                disabled={isLoading}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-blue-200 cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Login
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-sm text-blue-200">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            size="lg"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Login with Google
            <span className="text-xs ml-2">(Backup)</span>
          </Button>

          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-blue-200 text-xs">
            <Shield className="w-4 h-4" />
            <span>Secured with end-to-end encryption</span>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-6 text-blue-200 text-sm">
          Admin access only. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center animated-gradient">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
