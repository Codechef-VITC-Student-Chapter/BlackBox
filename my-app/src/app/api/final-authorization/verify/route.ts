import { NextResponse, type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { getAuthenticatedTeamFromToken } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import { jsonError } from "@/lib/http/responses";
import { completeModule, logSubmission, unlockNextModule } from "@/engine/gameEngine";
import { FIXED_RECOVERY_KEY, generateModule6EngineerId } from "@/engine/module6ChallengeGenerator";
import { Team } from "@/models/Team";
import { classifySubmission, parseSubmissionInput } from "@/validators/finalAuthorization";

export const runtime = "nodejs";

const MODULE_NUMBER = 6;
const REQUIRED_FORMAT_HINT = "Required format: RECOVERYKEY-ENGINEERID\nExample: BLACKBOX20260729-ENG12345";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;
  const authenticatedTeam = await getAuthenticatedTeamFromToken(token);

  if (!authenticatedTeam) {
    return jsonError("Unauthenticated.", 401);
  }

  if (authenticatedTeam.currentModule !== MODULE_NUMBER) {
    return jsonError("Module 6 is not currently active for your team.", 403);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const submission = parseSubmissionInput(payload);

  if (!submission) {
    return jsonError("A recovery submission is required.", 400);
  }

  const classification = classifySubmission(submission, FIXED_RECOVERY_KEY);

  if (classification.kind === "date-format-error") {
    await logSubmission({
      teamId: authenticatedTeam.teamId,
      module: MODULE_NUMBER,
      submittedAnswer: submission,
      isCorrect: false,
    });

    return NextResponse.json({
      valid: false,
      message: "System reads dates differently.",
    });
  }

  if (classification.kind === "key-only-correct") {
    await logSubmission({
      teamId: authenticatedTeam.teamId,
      module: MODULE_NUMBER,
      submittedAnswer: submission,
      isCorrect: false,
    });

    return NextResponse.json({
      valid: false,
      message: "You can't recover it without your Engineer ID.",
      hint: REQUIRED_FORMAT_HINT,
    });
  }

  if (classification.kind === "invalid") {
    await logSubmission({
      teamId: authenticatedTeam.teamId,
      module: MODULE_NUMBER,
      submittedAnswer: submission,
      isCorrect: false,
    });

    return NextResponse.json({
      valid: false,
      message: "RECOVERY SUBMISSION REJECTED",
    });
  }

  // classification.kind === "combined" — real correctness check
  await connectToDatabase();

  const team = await Team.findOne({ teamId: authenticatedTeam.teamId })
    .select("+eventToken")
    .lean<{ eventToken: string } | null>();

  if (!team) {
    return jsonError("Team not found.", 404);
  }

  const expectedEngineerId = generateModule6EngineerId(team.eventToken);
  const isCorrect =
    classification.recoveryKey === FIXED_RECOVERY_KEY && classification.engineerId === expectedEngineerId;

  await logSubmission({
    teamId: authenticatedTeam.teamId,
    module: MODULE_NUMBER,
    submittedAnswer: submission,
    isCorrect,
  });

  if (!isCorrect) {
    return NextResponse.json({
      valid: false,
      message: "RECOVERY SUBMISSION REJECTED",
    });
  }

  await completeModule(authenticatedTeam.teamId, MODULE_NUMBER);
  const nextModule = await unlockNextModule(authenticatedTeam.teamId);

  return NextResponse.json({ valid: true, nextModule });
}
