import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import type { ReactNode } from "react";

const MODULE_ROUTES: Record<number, string> = {
  1: "/authentication",
  2: "/repository-recovery",
  3: "/network-labyrinth",
  4: "/memory-reconstruction",
  5: "/core-vault",
  6: "/engineer-certification",
  7: "/final-authorization",
};

export default async function NetworkLabyrinthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    redirect("/authentication");
  }

  if (team.currentModule !== 3) {
    redirect(MODULE_ROUTES[team.currentModule] ?? "/authentication");
  }

  return children;
}
