import { connectToDatabase } from "@/lib/db/mongodb";
import { Progress } from "@/models/Progress";

export async function hasCompletedModule(teamId: string, module: number): Promise<boolean> {
  await connectToDatabase();

  const progress = await Progress.findOne({
    teamId,
    module,
    completed: true,
  })
    .select("_id")
    .lean<{ _id: unknown } | null>();

  return Boolean(progress);
}
