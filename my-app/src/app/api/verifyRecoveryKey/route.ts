import { NextResponse, type NextRequest } from "next/server";
import { REPOSITORY_RECOVERY_CHALLENGE } from "@/config/moduleChallenges";
import { completeModule, logSubmission, unlockNextModule } from "@/engine/gameEngine";
import { jsonError } from "@/lib/http/responses";
import { getActiveRepositoryRecoveryTeam, getRepositoryRecoveryState } from "@/lib/modules/repositoryRecovery";
import { Team } from "@/models/Team";
import { parseRecoveryKeyInput } from "@/validators/repositoryRecovery";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await getActiveRepositoryRecoveryTeam(request);

  if (!auth.ok) {
    return jsonError(auth.message, auth.status);
  }

  const state = await getRepositoryRecoveryState(auth.team.teamId);

  if (state.repositoryValidated !== true) {
    return jsonError("Repository has not been validated.", 403);
  }

  try {
    const body = await request.json();
    const recoveryKey = parseRecoveryKeyInput(body.recoveryKey);

    if (!recoveryKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Recovery Key is required."
        },
        { status: 400 }
      );
    }

    const isCorrect = recoveryKey.trim().toUpperCase() === REPOSITORY_RECOVERY_CHALLENGE.recoveryKey.toUpperCase();

    await logSubmission({
      teamId: auth.team.teamId,
      module: REPOSITORY_RECOVERY_CHALLENGE.moduleNumber,
      submittedAnswer: recoveryKey,
      isCorrect,
    });

    if (isCorrect) {
      await Team.updateOne(
        { teamId: auth.team.teamId },
        { $set: { "module2Data.recoveryKey": REPOSITORY_RECOVERY_CHALLENGE.recoveryKey } },
      );
      await completeModule(auth.team.teamId, REPOSITORY_RECOVERY_CHALLENGE.moduleNumber);
      const nextModule = await unlockNextModule(auth.team.teamId);

      return NextResponse.json({
        success: true,
        nextModule,
        nextRoute: REPOSITORY_RECOVERY_CHALLENGE.nextRoute
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Recovery Key"
        },
        { status: 400 }
      );
    }
  } catch {
    return jsonError("Server error parsing request.", 500);
  }
}
