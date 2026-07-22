import { type NextRequest, NextResponse } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";

export const runtime = "nodejs";

/**
 * GET /api/network-labyrinth/health
 * Context-only endpoint — no fragment hidden here.
 * Acts as a realistic health check call.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) return jsonError("Unauthenticated.", 401);

  return NextResponse.json(
    {
      status: "degraded",
      checks: {
        database:  "pass",
        cache:     "pass",
        gateway:   "fail",
        memory:    "fail",
      },
      timestamp: Date.now(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
