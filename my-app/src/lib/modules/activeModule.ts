import { type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import type { AuthenticatedTeam } from "@/types/auth";

export type ActiveModuleResult =
  | { ok: true; team: AuthenticatedTeam }
  | { ok: false; status: number; message: string };

export async function getActiveModuleTeam(
  request: NextRequest,
  moduleNumber: number,
  moduleName: string,
): Promise<ActiveModuleResult> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    return { ok: false, status: 401, message: "Unauthenticated." };
  }

  if (team.currentModule !== moduleNumber) {
    return {
      ok: false,
      status: 403,
      message: `${moduleName} is not currently active for your team.`,
    };
  }

  return { ok: true, team };
}
