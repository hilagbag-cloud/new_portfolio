import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  const isAdminSubdomain =
    hostname.startsWith("my.") ||
    hostname.startsWith("admin.") ||
    hostname.startsWith("cms.");

  const isLocalOrPreview =
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes(".run.app") ||
    hostname.includes(".vercel.app");

  // 1. Subdomain Access (e.g. my.domainname.site)
  // Automatically rewrite root "/" on subdomain directly to the admin panel
  if (isAdminSubdomain) {
    if (url.pathname === "/") {
      url.pathname = "/admin";
      const response = NextResponse.rewrite(url);
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      response.headers.set("x-is-admin-subdomain", "true");
      return response;
    }
  }

  // 2. Direct "/admin" path on main public domain (not on subdomain and not local preview)
  // Hide and block direct access from main domain -> redirect to home page
  if (url.pathname.startsWith("/admin") && !isAdminSubdomain && !isLocalOrPreview) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();

  // If visiting /admin routes, enforce strict no-indexing for privacy
  if (url.pathname.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
