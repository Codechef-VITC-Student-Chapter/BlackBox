import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { completeModule, logSubmission, unlockNextModule } from "@/engine/gameEngine";
import { jsonError } from "@/lib/http/responses";
import { getActiveModuleTeam } from "@/lib/modules/activeModule";
import { generateM3Fragments } from "@/lib/modules/m3fragments";
import { checkRateLimit } from "@/lib/rateLimit";
import { Team } from "@/models/Team";

export const runtime = "nodejs";

const MODULE_NUMBER = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 8;

function normalizeSubmittedFragment(fragment: unknown, index: number): string {
  if (typeof fragment !== "string") return "";

  const value = fragment.trim().toUpperCase();

  if (index === 0 && value.startsWith("NL-")) {
    return value.slice(3);
  }

  if (index === 3 && value.startsWith("0X")) {
    const hex = value.slice(2);

    if (!/^[0-9A-F]+$/.test(hex) || hex.length % 2 !== 0) {
      return value;
    }

    try {
      return Buffer.from(hex, "hex").toString("utf8").toUpperCase();
    } catch {
      return value;
    }
  }

  return value;
}

function validateSubmittedFragments(submittedFragments: unknown, expectedFragments: string[]): boolean {
  if (!Array.isArray(submittedFragments) || submittedFragments.length !== expectedFragments.length) {
    return false;
  }

  return expectedFragments.every((expected, index) => {
    const normalized = normalizeSubmittedFragment(submittedFragments[index], index);
    return normalized === expected;
  });
}

/**
 * POST /api/network-labyrinth/validate
 *
 * Validates the gateway recovery key submitted by participants.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await getActiveModuleTeam(request, MODULE_NUMBER, "Network Labyrinth");

  if (!auth.ok) return jsonError(auth.message, auth.status);

  const rateLimit = checkRateLimit(`network-labyrinth:${auth.team.teamId}`, {
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        valid: false,
        message: `Too many validation attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: { key?: string; fragments?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid request body." }, { status: 400 });
  }

  const submitted = (body.key ?? "").trim().toUpperCase();

  await connectToDatabase();
  const teamDoc = await Team.findOne({ teamId: auth.team.teamId })
    .select("+eventToken")
    .lean<{ eventToken: string } | null>();

  if (!teamDoc) return jsonError("Team not found.", 404);

  const { fragment1, fragment2, fragment3, fragment4, recoveryKey } = generateM3Fragments(teamDoc.eventToken);
  const fragmentsAreCorrect = validateSubmittedFragments(body.fragments, [
    fragment1,
    fragment2,
    fragment3,
    fragment4,
  ]);

  const combinedKey = `${fragment1}${fragment2}${fragment3}${fragment4}`;
  const isKeyValid = 
    submitted === recoveryKey || 
    submitted === combinedKey || 
    submitted === `NL-${combinedKey}` || 
    submitted.replace(/NL-/g, "") === combinedKey;

  const isCorrect = fragmentsAreCorrect && (isKeyValid || submitted.length > 0);

  await logSubmission({
    teamId: auth.team.teamId,
    module: MODULE_NUMBER,
    submittedAnswer: submitted || "FRAGMENTS_SUBMITTED",
    isCorrect,
  });

  if (!isCorrect) {
    return NextResponse.json(
      { valid: false, message: "Invalid Recovery Key. Continue investigating." },
      { status: 401 }
    );
  }

  await Team.updateOne(
    { teamId: auth.team.teamId },
    { $set: { "module3Data.recoveryKey": recoveryKey } },
  );
  await completeModule(auth.team.teamId, MODULE_NUMBER);
  await unlockNextModule(auth.team.teamId);

  return NextResponse.json({ valid: true, message: "Gateway Recovery Complete." });
}
