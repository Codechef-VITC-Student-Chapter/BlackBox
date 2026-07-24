import { NextResponse, type NextRequest } from "next/server";
import { REPOSITORY_RECOVERY_CHALLENGE, getRepositoryRecoveryUrl } from "@/config/moduleChallenges";
import { logSubmission } from "@/engine/gameEngine";
import { jsonError } from "@/lib/http/responses";
import { getActiveRepositoryRecoveryTeam, markRepositoryValidated } from "@/lib/modules/repositoryRecovery";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await getActiveRepositoryRecoveryTeam(request);

  if (!auth.ok) {
    return jsonError(auth.message, auth.status);
  }

  try {
    const body = await request.json();
    const { owner, repository } = body;

    if (!owner || !repository) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input parameters. Please supply owner and repository."
        },
        { status: 400 }
      );
    }

    const cleanOwner = owner.trim().toLowerCase();
    const cleanRepo = repository.trim().toLowerCase();
    const expectedOwner = REPOSITORY_RECOVERY_CHALLENGE.owner.toLowerCase();
    const expectedRepo = REPOSITORY_RECOVERY_CHALLENGE.repository.toLowerCase();
    const submittedAnswer = `https://github.com/${cleanOwner}/${cleanRepo}`;
    const isCorrect = cleanOwner === expectedOwner && cleanRepo === expectedRepo;

    await logSubmission({
      teamId: auth.team.teamId,
      module: REPOSITORY_RECOVERY_CHALLENGE.moduleNumber,
      submittedAnswer,
      isCorrect,
    });

    if (isCorrect) {
      const verifiedUrl = getRepositoryRecoveryUrl();
      await markRepositoryValidated(auth.team.teamId, verifiedUrl);

      return NextResponse.json({
        success: true,
        url: verifiedUrl,
        verifiedUrl,
        message: "Repository Located. Connecting..."
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: cleanOwner !== expectedOwner ? "Wrong repository owner." : "Wrong repository name."
      }, 
      { status: 404 }
    );
  } catch {
    return jsonError("Server error parsing request.", 500);
  }
}
