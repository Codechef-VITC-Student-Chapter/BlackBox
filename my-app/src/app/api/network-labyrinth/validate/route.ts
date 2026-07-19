import { type NextRequest, NextResponse } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import { completeModule, logSubmission, unlockNextModule } from "@/engine/gameEngine";
import { jsonError } from "@/lib/http/responses";
import { generateM3Fragments } from "@/lib/modules/m3fragments";
import { Team } from "@/models/Team";

export const runtime = "nodejs";

const MODULE_NUMBER = 3;

/**
 * POST /api/network-labyrinth/validate
 *
 * Validates the gateway recovery key submitted by participants.
 * - Authenticates the team via session cookie.
 * - Derives the expected recovery key from the team's eventToken.
 * - Logs the submission attempt.
 * - On success: marks module complete + unlocks Module 4.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const team = await getAuthenticatedTeamFromToken(token);

  if (!team) return jsonError("Unauthenticated.", 401);

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: { key?: string; fragments?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid request body." }, { status: 400 });
  }

  const submitted = (body.key ?? "").trim().toUpperCase();

  if (!submitted) {
    return NextResponse.json(
      { valid: false, message: "Recovery key cannot be empty." },
      { status: 400 }
    );
  }

  // ── Fetch team's eventToken & generate expected key ───────────────────────
  await connectToDatabase();
  const teamDoc = await Team.findOne({ teamId: team.teamId })
    .select("+eventToken")
    .lean<{ eventToken: string } | null>();

  if (!teamDoc) return jsonError("Team not found.", 404);

  const { recoveryKey } = generateM3Fragments(teamDoc.eventToken);
  const isCorrect = submitted === recoveryKey;

  // ── Log every submission attempt ──────────────────────────────────────────
  await logSubmission({
    teamId: team.teamId,
    module: MODULE_NUMBER,
    submittedAnswer: submitted,
    isCorrect,
  });

  // ── Wrong key ─────────────────────────────────────────────────────────────
  if (!isCorrect) {
    return NextResponse.json(
      { valid: false, message: "Invalid Recovery Key. Continue investigating." },
      { status: 401 }
    );
  }

  // ── Correct key: complete module + unlock next ────────────────────────────
  await completeModule(team.teamId, MODULE_NUMBER);
  await unlockNextModule(team.teamId);

  return NextResponse.json({ valid: true, message: "Gateway Recovery Complete." });
}
