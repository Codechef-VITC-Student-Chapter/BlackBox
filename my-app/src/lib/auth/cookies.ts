import type { NextResponse } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getServerEnv } from "@/config/env";

export function setAuthCookie(response: NextResponse, token: string): void {
  const { NODE_ENV } = getServerEnv();

  response.cookies.set({
    name: GAME_CONFIG.authCookieName,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: NODE_ENV === "production",
    path: "/",
    maxAge: GAME_CONFIG.authCookieMaxAgeSeconds,
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: GAME_CONFIG.authCookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: getServerEnv().NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
