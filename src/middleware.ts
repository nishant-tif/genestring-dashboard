import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Security headers middleware
export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;
  const isPublicPath = pathname === "/";
  const isStaticFile = /\.[^/]+$/.test(pathname);

  let response: NextResponse;

  if (isStaticFile) {
    response = NextResponse.next();
  } else if (!token && !isPublicPath) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else if (token && (isPublicPath || pathname === "/dashboard")) {
    response = NextResponse.redirect(
      new URL("/dashboard/widgets/podcast", request.url),
    );
  } else {
    response = NextResponse.next();
  }

  // Security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "connect-src 'self' http://localhost:3002 http://localhost:3000 http://127.0.0.1:3000 http://127.0.0.1:3002 https://devapi.genestringlab.com https://api.genestringlab.com https://prodapi.genestringlab.com",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
    ].join("; "),
  );

  // Prevent caching of sensitive pages
  // if (
  //   request.nextUrl.pathname.startsWith("/dashboard") ||
  //   request.nextUrl.pathname.startsWith("/policy") ||
  //   request.nextUrl.pathname.startsWith("/model") ||
  //   request.nextUrl.pathname.startsWith("/organizations") ||
  //   request.nextUrl.pathname.startsWith("/profile")
  // ) {
  //   response.headers.set("Cache-Control", "no-store, max-age=0");
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
