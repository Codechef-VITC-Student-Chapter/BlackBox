import { type NextRequest } from "next/server";
import { REPOSITORY_RECOVERY_CHALLENGE } from "@/config/moduleChallenges";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getActiveModuleTeam } from "@/lib/modules/activeModule";
import { Progress } from "@/models/Progress";
import type { AuthenticatedTeam } from "@/types/auth";

export type RepositoryRecoveryState = {
  repositoryValidated?: boolean;
  verifiedRepositoryUrl?: string;
  repositoryValidatedAt?: Date;
};

export type RepositoryRecoveryAuthResult =
  | { ok: true; team: AuthenticatedTeam }
  | { ok: false; status: number; message: string };

export async function getActiveRepositoryRecoveryTeam(
  request: NextRequest,
): Promise<RepositoryRecoveryAuthResult> {
  return getActiveModuleTeam(
    request,
    REPOSITORY_RECOVERY_CHALLENGE.moduleNumber,
    "Repository Recovery",
  );
}

export async function markRepositoryValidated(teamId: string, verifiedRepositoryUrl: string): Promise<void> {
  await connectToDatabase();

  await Progress.updateOne(
    { teamId, module: REPOSITORY_RECOVERY_CHALLENGE.moduleNumber },
    {
      $set: {
        "moduleState.repositoryValidated": true,
        "moduleState.verifiedRepositoryUrl": verifiedRepositoryUrl,
        "moduleState.repositoryValidatedAt": new Date(),
      },
      $setOnInsert: { completed: false },
    },
    { upsert: true },
  );
}

export async function getRepositoryRecoveryState(teamId: string): Promise<RepositoryRecoveryState> {
  await connectToDatabase();

  const progress = await Progress.findOne({
    teamId,
    module: REPOSITORY_RECOVERY_CHALLENGE.moduleNumber,
  })
    .select("moduleState")
    .lean<{ moduleState?: RepositoryRecoveryState } | null>();

  return progress?.moduleState ?? {};
}
