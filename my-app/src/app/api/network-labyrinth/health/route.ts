import { type NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/http/responses";
import { getActiveModuleTeam } from "@/lib/modules/activeModule";

export const runtime = "nodejs";

/**
 * GET /api/network-labyrinth/health
 * Context-only endpoint — no fragment hidden here.
 * Acts as a realistic health check call.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await getActiveModuleTeam(request, 3, "Network Labyrinth");

  if (!auth.ok) return jsonError(auth.message, auth.status);

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
