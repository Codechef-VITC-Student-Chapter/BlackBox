import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { jsonError } from "@/lib/http/responses";
import { getActiveModuleTeam } from "@/lib/modules/activeModule";
import { generateM3Fragments } from "@/lib/modules/m3fragments";
import { Team } from "@/models/Team";

export const runtime = "nodejs";

/**
 * GET /api/network-labyrinth/recovery
 * Fragment 4 hidden in _trace field as hex-encoded ASCII.
 * Participants decode "0x{hex}" → ASCII → Fragment 4.
 * The Activity Logs 0x274C offset hints at this endpoint.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await getActiveModuleTeam(request, 3, "Network Labyrinth");

  if (!auth.ok) return jsonError(auth.message, auth.status);

  await connectToDatabase();
  const teamDoc = await Team.findOne({ teamId: auth.team.teamId })
    .select("+eventToken")
    .lean<{ eventToken: string } | null>();

  if (!teamDoc) return jsonError("Team not found.", 404);

  const { fragment4Hex } = generateM3Fragments(teamDoc.eventToken);

  return NextResponse.json(
    {
      gateway: "ONLINE",
      mode: "recovery",
      _trace: `0x${fragment4Hex}`,
      note: "You found this. Keep decoding.",
      timestamp: Date.now(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
