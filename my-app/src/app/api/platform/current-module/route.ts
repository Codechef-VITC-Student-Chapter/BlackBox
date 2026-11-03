import { NextResponse, type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    return jsonError("Unauthenticated.", 401);
  }

  return NextResponse.json({
    teamId: team.teamId,
    currentModule: team.currentModule,
  });
}
