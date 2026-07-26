import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { jsonError } from "@/lib/http/responses";
import { getActiveModuleTeam } from "@/lib/modules/activeModule";
import { generateM3Fragments } from "@/lib/modules/m3fragments";
import { Team } from "@/models/Team";

export const runtime = "nodejs";

/**
 * GET /api/network-labyrinth/status
 * Fragment 1 hidden in X-Node-Id response header.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await getActiveModuleTeam(request, 3, "Network Labyrinth");

  if (!auth.ok) return jsonError(auth.message, auth.status);

  await connectToDatabase();
  const teamDoc = await Team.findOne({ teamId: auth.team.teamId })
    .select("+eventToken")
    .lean<{ eventToken: string } | null>();

  if (!teamDoc) return jsonError("Team not found.", 404);

  const { fragment1 } = generateM3Fragments(teamDoc.eventToken);

  return NextResponse.json(
    { status: "degraded", uptime: "71.3%", mode: "recovery", timestamp: Date.now() },
    {
      headers: {
        "X-Node-Id": `NL-${fragment1}`,
        "Cache-Control": "no-store",
      },
    }
  );
}
