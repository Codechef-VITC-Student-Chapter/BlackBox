import { NextResponse, type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { setAuthCookie } from "@/lib/auth/cookies";
import { signAuthToken } from "@/lib/auth/jwt";
import { connectToDatabase } from "@/lib/db/mongodb";
import { jsonError } from "@/lib/http/responses";
import { Team } from "@/models/Team";
import { parseLoginInput } from "@/validators/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const input = parseLoginInput(payload);

  if (!input) {
    return jsonError("Team ID and PIN are required.", 400);
  }

  await connectToDatabase();

  const team = await Team.findOne({ teamId: input.teamId })
    .select("+loginPin teamId teamName currentModule score")
    .lean<{
      teamId: string;
      teamName: string;
      loginPin: string;
      currentModule: number;
      score: number;
    } | null>();

  if (!team || team.loginPin !== input.pin) {
    return jsonError("Invalid Team ID or PIN.", 401);
  }

  const token = await signAuthToken(
    { teamId: team.teamId },
    GAME_CONFIG.authCookieMaxAgeSeconds,
  );
  const response = NextResponse.json({
    team: {
      teamId: team.teamId,
      teamName: team.teamName,
      currentModule: team.currentModule,
      score: team.score,
    },
  });

  setAuthCookie(response, token);

  return response;
}
