import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Public routes that do not require authentication
 */
const PUBLIC_ROUTES = ["/", "/login"];

export const proxy = auth((request) => {
  const { nextUrl, auth } = request;

  const isLoggedIn = !!auth;
  
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  // 1. Always allow API Auth routes (login/callback/session)
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. If it's a public route, let them through
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 3. If NOT logged in and trying to access a private route
  if (!isLoggedIn) {
    const url = nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 4. If logged in but trying to access Admin without Admin role
  if (isAdminRoute && auth.user?.role !== "ADMIN") {
    const url = nextUrl.clone();
    url.pathname = "/forbidden";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  // Protect all routes except static files and images
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
