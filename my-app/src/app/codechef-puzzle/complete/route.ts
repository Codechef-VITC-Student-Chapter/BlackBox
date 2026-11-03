import { NextResponse, type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { completeModule, unlockNextModule } from "@/engine/gameEngine";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import { jsonError } from "@/lib/http/responses";
import { getActiveModuleTeam } from "@/lib/modules/activeModule";
import { hasCompletedModule } from "@/lib/modules/progress";
import { Team } from "@/models/Team";

export const runtime = "nodejs";
const MODULE_NUMBER = 4;

function applyRot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const input = char.charCodeAt(0);
    const base = input >= 97 ? 97 : 65;
    return String.fromCharCode(((input - base + 13) % 26) + base);
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) {
    return jsonError("Unauthenticated.", 401);
  }

  if (team.currentModule !== MODULE_NUMBER + 1 || !(await hasCompletedModule(team.teamId, MODULE_NUMBER))) {
    return jsonError("CodeChef Puzzle has not been completed.", 403);
  }

  await connectToDatabase();

  const teamDoc = await Team.findOne({ teamId: team.teamId })
    .select("module4Data.encryptedKey")
    .lean<{ module4Data?: { encryptedKey?: string | null } } | null>();

  const encryptedKey = teamDoc?.module4Data?.encryptedKey;

  if (!encryptedKey) {
    return jsonError("Encrypted key not found.", 404);
  }

  return NextResponse.json({
    success: true,
    encryptedKey,
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await getActiveModuleTeam(request, MODULE_NUMBER, "CodeChef Puzzle");

  if (!auth.ok) {
    return jsonError(auth.message, auth.status);
  }

  await connectToDatabase();

  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const plaintextFragment = `BBX-FRAG-${randomSuffix}`;
  const encryptedFragment = applyRot13(plaintextFragment);

  await Team.updateOne(
    { teamId: auth.team.teamId },
    {
      $set: {
        "module4Data.plaintextKey": plaintextFragment,
        "module4Data.encryptedKey": encryptedFragment,
      },
    }
  );

  await completeModule(auth.team.teamId, MODULE_NUMBER);
  await unlockNextModule(auth.team.teamId);

  return NextResponse.json({
    success: true,
    encryptedKey: encryptedFragment,
  });
}
