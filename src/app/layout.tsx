import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { FacebookPixel } from "@/components/analytics/FacebookPixel";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { MaintenanceCheck } from "@/components/MaintenanceCheck";
import { ToastProvider } from "@/components/ui/Toast";

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "jewelry",
    "rings",
    "necklaces",
    "bracelets",
    "earrings",
    "luxury",
    "diamond",
    "gold",
    "silver",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <FacebookPixel />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ToastProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <MaintenanceCheck />
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
                  },
                }}
              />
            </ThemeProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
