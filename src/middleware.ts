import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Keep this true while the temporary ban is active.
const TEMPORARY_BAN_ENABLED = true;
const MAINTENANCE_PATH = "/maintenance";

export function middleware(request: NextRequest) {
  if (!TEMPORARY_BAN_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow only framework/system assets and the maintenance page itself.
  const isSystemPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml");

  if (
    isSystemPath ||
    pathname === MAINTENANCE_PATH ||
    pathname.startsWith(`${MAINTENANCE_PATH}/`)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = MAINTENANCE_PATH;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
