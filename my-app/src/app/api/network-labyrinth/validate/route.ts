import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { completeModule, logSubmission, unlockNextModule } from "@/engine/gameEngine";
import { jsonError } from "@/lib/http/responses";
import { getActiveModuleTeam } from "@/lib/modules/activeModule";
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
  const auth = await getActiveModuleTeam(request, MODULE_NUMBER, "Network Labyrinth");

  if (!auth.ok) return jsonError(auth.message, auth.status);

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
  const teamDoc = await Team.findOne({ teamId: auth.team.teamId })
    .select("+eventToken")
    .lean<{ eventToken: string } | null>();

  if (!teamDoc) return jsonError("Team not found.", 404);

  const { recoveryKey } = generateM3Fragments(teamDoc.eventToken);
  const isCorrect = submitted === recoveryKey;

  // ── Log every submission attempt ──────────────────────────────────────────
  await logSubmission({
    teamId: auth.team.teamId,
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
  await completeModule(auth.team.teamId, MODULE_NUMBER);
  await unlockNextModule(auth.team.teamId);

  return NextResponse.json({ valid: true, message: "Gateway Recovery Complete." });
}
