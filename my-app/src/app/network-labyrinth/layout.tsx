import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { hasCompletedModule } from "@/lib/modules/progress";
import type { ReactNode } from "react";

const MODULE_ROUTES: Record<number, string> = {
  1: "/authentication",
  2: "/repository-recovery",
  3: "/network-labyrinth",
  4: "/codechef-puzzle",
  5: "/core-vault",
  6: "/engineer-certification",
  7: "/final-authorization",
};

const MODULE_NUMBER = 3;
const SUCCESS_ROUTE = "/network-labyrinth/success";

export default async function NetworkLabyrinthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const token = cookieStore.get(GAME_CONFIG.authCookieName)?.value;
  const pathname = headerStore.get("x-blackbox-pathname");
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    redirect("/authentication");
  }

  if (team.currentModule !== MODULE_NUMBER) {
    const completedModule3 = await hasCompletedModule(team.teamId, MODULE_NUMBER);

    if (pathname === SUCCESS_ROUTE && completedModule3 && team.currentModule === MODULE_NUMBER + 1) {
      return children;
    }

    redirect(MODULE_ROUTES[team.currentModule] ?? "/authentication");
  }

  return children;
}
