import { type NextRequest, NextResponse } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import { jsonError } from "@/lib/http/responses";
import { generateM3Fragments } from "@/lib/modules/m3fragments";
import { Team } from "@/models/Team";

export const runtime = "nodejs";

/**
 * GET /api/network-labyrinth/services
 * Fragment 2 hidden in JSON body → _meta.sig field.
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

  const { fragment2 } = generateM3Fragments(teamDoc.eventToken);

  return NextResponse.json(
    {
      count: 6,
      services: [
        { id: "auth-svc",    status: "UP"   },
        { id: "repo-svc",    status: "UP"   },
        { id: "gateway-svc", status: "WARN" },
        { id: "log-svc",     status: "UP"   },
        { id: "cache-svc",   status: "UP"   },
        { id: "core-svc",    status: "DOWN" },
      ],
      _meta: { sig: fragment2 },
      timestamp: Date.now(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
