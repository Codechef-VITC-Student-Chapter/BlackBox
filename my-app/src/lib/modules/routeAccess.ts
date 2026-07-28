import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { hasCompletedModule } from "@/lib/modules/progress";
import type { AuthenticatedTeam } from "@/types/auth";

const MODULE_ROUTES: Record<number, string> = {
  1: "/authentication",
  2: "/repository-recovery",
  3: "/network-labyrinth",
  4: "/codechef-puzzle",
  5: "/core-vault",
  6: "/engineer-certification",
  7: "/engineer-certification/victory-capture",
};

type CompletedSuccessRoute = {
  route: string | string[];
  completedModule: number;
  nextModule: number;
};

export async function requireModuleRouteAccess(
  moduleNumber: number,
  completedSuccessRoute?: CompletedSuccessRoute,
): Promise<AuthenticatedTeam> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const token = cookieStore.get(GAME_CONFIG.authCookieName)?.value;
  const pathname = headerStore.get("x-blackbox-pathname");
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    redirect("/authentication");
  }

  const isSuccessRoute = completedSuccessRoute
    ? Array.isArray(completedSuccessRoute.route)
      ? completedSuccessRoute.route.includes(pathname ?? "")
      : pathname === completedSuccessRoute.route
    : false;

  if (team.currentModule === moduleNumber) {
    if (isSuccessRoute) {
      redirect(MODULE_ROUTES[moduleNumber] ?? "/authentication");
    }

    return team;
  }

  if (
    isSuccessRoute &&
    team.currentModule === completedSuccessRoute!.nextModule &&
    (await hasCompletedModule(team.teamId, completedSuccessRoute!.completedModule))
  ) {
    return team;
  }

  redirect(MODULE_ROUTES[team.currentModule] ?? "/authentication");
}
