import Image from "next/image";
import Link from "next/link";
import { Construction, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-red-700/20 via-red-800/20 to-red-700/20 p-2 ring-4 ring-red-700/40">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Shergill Official Logo"
                fill
                className="object-cover scale-110"
              />
            </div>
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <Construction className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent">
            We'll Be Right Back!
          </h1>
          <p className="text-xl text-muted-foreground">
            Shergill Official is currently undergoing scheduled maintenance.
          </p>
          <p className="text-muted-foreground">
            We're working hard to improve your shopping experience.
            <br />
            Please check back soon!
          </p>
        </div>

        {/* Features During Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="font-semibold mb-2">Quick Maintenance</h3>
            <p className="text-sm text-muted-foreground">
              We expect to be back online shortly
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold mb-2">Improvements</h3>
            <p className="text-sm text-muted-foreground">
              Adding new features and enhancements
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold mb-2">Stay Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your data is safe during maintenance
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Need immediate assistance?
          </p>
          <div className="flex justify-center gap-4">
            <Link href="mailto:info@shergillofficial.com">
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-8">
          <Link
            href="/admin/login"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Admin Access →
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-12">
          © {new Date().getFullYear()} Shergill Official. All rights reserved.
        </p>
      </div>
    </div>
  );
}
