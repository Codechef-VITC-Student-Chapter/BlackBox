import { type NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/http/responses";
import { getActiveModuleTeam } from "@/lib/modules/activeModule";

export const runtime = "nodejs";

/**
 * GET /api/network-labyrinth/network
 * Context-only endpoint — no fragment hidden here.
 * Acts as a red herring / realistic network diagnostic call.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await getActiveModuleTeam(request, 3, "Network Labyrinth");

  if (!auth.ok) return jsonError(auth.message, auth.status);

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
