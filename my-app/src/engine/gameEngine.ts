import { GAME_CONFIG } from "@/config/game";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Progress } from "@/models/Progress";
import { Submission } from "@/models/Submission";
import { Team } from "@/models/Team";
import { isValidModule } from "@/validators/modules";

export type SubmissionLogInput = {
  teamId: string;
  module: number;
  submittedAnswer: string;
  isCorrect: boolean;
};

export async function getCurrentModule(teamId: string): Promise<number> {
  await connectToDatabase();

  const team = await Team.findOne({ teamId }).select("currentModule").lean<{ currentModule: number } | null>();

  if (!team) {
    throw new Error(`Team not found: ${teamId}`);
  }

  return team.currentModule;
}

export async function updateScore(teamId: string, delta: number): Promise<number> {
  await connectToDatabase();

  const team = await Team.findOneAndUpdate(
    { teamId },
    { $inc: { score: delta } },
    { new: true, projection: { score: 1 } },
  ).lean<{ score: number } | null>();

  if (!team) {
    throw new Error(`Team not found: ${teamId}`);
  }

  return team.score;
}

export async function logSubmission(input: SubmissionLogInput): Promise<void> {
  if (!isValidModule(input.module)) {
    throw new Error(`Invalid module number: ${input.module}`);
  }

  await connectToDatabase();

  await Promise.all([
    Submission.create(input),
    Progress.updateOne(
      { teamId: input.teamId, module: input.module },
      { $inc: { attempts: 1 }, $setOnInsert: { completed: false } },
      { upsert: true },
    ),
  ]);
}

export async function completeModule(teamId: string, module: number): Promise<void> {
  if (!isValidModule(module)) {
    throw new Error(`Invalid module number: ${module}`);
  }

  await connectToDatabase();

  const currentModule = await getCurrentModule(teamId);

  if (currentModule !== module) {
    throw new Error(`Team ${teamId} can only complete module ${currentModule}`);
  }

  await Progress.updateOne(
    { teamId, module },
    { $set: { completed: true, completedAt: new Date() } },
    { upsert: true },
  );
}

export async function unlockNextModule(teamId: string): Promise<number> {
  await connectToDatabase();

  const currentModule = await getCurrentModule(teamId);
  const nextModule = Math.min(currentModule + 1, GAME_CONFIG.totalModules);

  const team = await Team.findOneAndUpdate(
    { teamId, currentModule },
    { $set: { currentModule: nextModule } },
    { new: true, projection: { currentModule: 1 } },
  ).lean<{ currentModule: number } | null>();

  if (!team) {
    throw new Error(`Unable to unlock next module for team ${teamId}`);
  }

  return team.currentModule;
}
