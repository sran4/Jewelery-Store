"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { FancySpinnerOverlay } from "@/components/common/FancySpinner";

export function MaintenanceCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Don't check on admin or maintenance pages
    if (pathname?.startsWith("/admin") || pathname === "/maintenance") {
      setChecking(false);
      return;
    }

    async function checkMaintenance() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        // Check if user has actual session (not just loading state)
        const isAdmin = status === "authenticated" && !!session?.user;

        console.log("🔍 Maintenance check:", {
          path: pathname,
          maintenanceMode: data.settings?.features?.maintenanceMode,
          sessionStatus: status,
          hasSession: !!session,
          hasUser: !!session?.user,
          isAdmin: isAdmin,
        });

        // If maintenance mode is on and user is NOT authenticated admin, redirect
        if (data.settings?.features?.maintenanceMode && !isAdmin) {
          console.log(
            "🚧 Redirecting to maintenance page - not authenticated admin"
          );
          window.location.href = "/maintenance";
          return;
        } else {
          console.log("✅ Allowing access");
          setChecking(false);
        }
      } catch (error) {
        console.error("Maintenance check error:", error);
        setChecking(false);
      }
    }

    // Only check after session status is determined
    if (status !== "loading") {
      checkMaintenance();
    } else {
      console.log("⏳ Waiting for session status...");
    }
  }, [session, status, pathname, router]);

  // Show loading state while checking
  if (
    checking &&
    !pathname?.startsWith("/admin") &&
    pathname !== "/maintenance"
  ) {
    return (
      <FancySpinnerOverlay
        size="xl"
        text="Loading Shergill Official"
        subtext="Preparing your jewelry experience"
      />
    );
  }

  return null;
}
