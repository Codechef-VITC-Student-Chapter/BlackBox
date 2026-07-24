import { type NextRequest, NextResponse } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import { jsonError } from "@/lib/http/responses";
import { generateM3Fragments } from "@/lib/modules/m3fragments";
import { Team } from "@/models/Team";

export const runtime = "nodejs";

/**
 * GET /api/network-labyrinth/internal
 * Returns 403. Fragment 3 hidden in X-Restricted-Fragment response header.
 * Key insight: participants must inspect a FAILED (red) request in DevTools.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) return jsonError("Unauthenticated.", 401);

  await connectToDatabase();
  const teamDoc = await Team.findOne({ teamId: team.teamId })
    .select("+eventToken")
    .lean<{ eventToken: string } | null>();

  if (!teamDoc) return jsonError("Team not found.", 404);

  const { fragment3 } = generateM3Fragments(teamDoc.eventToken);

  return NextResponse.json(
    { error: "ACCESS_DENIED", code: 403, reason: "Insufficient clearance level." },
    {
      status: 403,
      headers: {
        "X-Restricted-Fragment": fragment3,
        "Cache-Control": "no-store",
      },
    }
  );
}
