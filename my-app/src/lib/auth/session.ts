import { connectToDatabase } from "@/lib/db/mongodb";
import { Team } from "@/models/Team";
import { verifyAuthToken } from "@/lib/auth/jwt";
import type { AuthenticatedTeam } from "@/types/auth";

export async function getAuthenticatedTeamFromToken(token?: string): Promise<AuthenticatedTeam | null> {
  if (!token) {
    return null;
  }

  const payload = await verifyAuthToken(token);

  if (!payload) {
    return null;
  }

  await connectToDatabase();

  const team = await Team.findOne({ teamId: payload.teamId })
    .select("teamId teamName currentModule score")
    .lean<AuthenticatedTeam | null>();

  return team;
}
