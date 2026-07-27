import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-blackbox-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/repository-recovery/:path*",
    "/network-labyrinth/:path*",
    "/codechef-puzzle/:path*",
    "/core-vault/:path*",
    "/engineer-certification/:path*",
    "/final-authorization/:path*",
  ],
};
