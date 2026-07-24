import { NextResponse, type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import { jsonError } from "@/lib/http/responses";
import { Team } from "@/models/Team";

export const runtime = "nodejs";

function applyRot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const input = char.charCodeAt(0);
    const base = input >= 97 ? 97 : 65;
    return String.fromCharCode(((input - base + 13) % 26) + base);
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    return jsonError("Unauthenticated.", 401);
  }

  await connectToDatabase();

  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const plaintextFragment = `BBX-FRAG-${randomSuffix}`;
  const encryptedFragment = applyRot13(plaintextFragment);

  await Team.updateOne(
    { teamId: team.teamId },
    {
      $set: {
        "module4Data.plaintextKey": plaintextFragment,
        "module4Data.encryptedKey": encryptedFragment,
        currentModule: 5,
      },
    }
  );

  return NextResponse.json({
    success: true,
    encryptedKey: encryptedFragment,
  });
}