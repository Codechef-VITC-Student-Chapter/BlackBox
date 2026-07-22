import { type NextRequest, NextResponse } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";

export const runtime = "nodejs";

/**
 * GET /api/network-labyrinth/network
 * Context-only endpoint — no fragment hidden here.
 * Acts as a red herring / realistic network diagnostic call.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) return jsonError("Unauthenticated.", 401);

  return NextResponse.json(
    {
      interfaces: [
        { name: "eth0", status: "UP",   rx: "1.2GB", tx: "340MB" },
        { name: "eth1", status: "DOWN", rx: "0B",    tx: "0B"    },
      ],
      latency_ms: 142,
      packet_loss: "17%",
      timestamp: Date.now(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
