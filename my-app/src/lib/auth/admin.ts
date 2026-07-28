import { type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import type { AuthenticatedTeam } from "@/types/auth";

export const PARTICIPANTS_NOT_ALLOWED_MESSAGE = "Participants are not allowed.";

export type AdminAuthorizationResult =
  | { ok: true; team: AuthenticatedTeam }
  | { ok: false; status: number; message: string };

export async function getAdminAuthorizationFromToken(token?: string): Promise<AdminAuthorizationResult> {
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    return { ok: false, status: 401, message: "Unauthenticated." };
  }

  if (team.role !== "admin") {
    return { ok: false, status: 403, message: PARTICIPANTS_NOT_ALLOWED_MESSAGE };
  }

  return { ok: true, team };
}

export async function getAdminAuthorizationFromRequest(
  request: NextRequest,
): Promise<AdminAuthorizationResult> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  return getAdminAuthorizationFromToken(token);
}

export function adminAuthorizationError(auth: Extract<AdminAuthorizationResult, { ok: false }>) {
  return jsonError(auth.message, auth.status);
}
