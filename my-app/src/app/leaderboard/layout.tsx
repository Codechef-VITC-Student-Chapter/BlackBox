import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GAME_CONFIG } from "@/config/game";
import {
  getAdminAuthorizationFromToken,
  PARTICIPANTS_NOT_ALLOWED_MESSAGE,
} from "@/lib/auth/admin";
import type { ReactNode } from "react";

export default async function LeaderboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(GAME_CONFIG.authCookieName)?.value;
  const auth = await getAdminAuthorizationFromToken(token);

  if (!auth.ok && auth.status === 401) {
    redirect("/authentication");
  }

  if (!auth.ok) {
    return <>{PARTICIPANTS_NOT_ALLOWED_MESSAGE}</>;
  }

  return children;
}
