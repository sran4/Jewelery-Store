import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Note: Admin routes are protected by layout.tsx, not middleware
  // This prevents redirect loops

  // Note: Maintenance mode is checked client-side in MaintenanceCheck component
  // Middleware can't reliably use Mongoose in Next.js App Router

  // Protect /api routes (except auth and public endpoints)
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    // Allow public endpoints
    const publicEndpoints = [
      "/api/products",
      "/api/categories",
      "/api/settings",
      "/api/contact",
    ];

    const isPublicEndpoint = publicEndpoints.some(
      (endpoint) => pathname.startsWith(endpoint) && request.method === "GET"
    );

    if (!isPublicEndpoint) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  // HTTPS enforcement in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${pathname}`,
      301
    );
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
};
