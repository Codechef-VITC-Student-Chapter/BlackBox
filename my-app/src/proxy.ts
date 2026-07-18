import { NextResponse, type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";

function redirectTo(pathname: string, request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(pathname, request.url));
}

function getRequestedModule(pathname: string): number | null {
  const match = pathname.match(/^\/module\/(\d+)(?:\/.*)?$/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    return pathname === "/authentication"
      ? NextResponse.next()
      : redirectTo("/authentication", request);
  }

  if (pathname === "/authentication") {
    return redirectTo(`/module/${team.currentModule}`, request);
  }

  const requestedModule = getRequestedModule(pathname);

  if (requestedModule !== team.currentModule) {
    return redirectTo(`/module/${team.currentModule}`, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authentication", "/module/:path*"],
};
