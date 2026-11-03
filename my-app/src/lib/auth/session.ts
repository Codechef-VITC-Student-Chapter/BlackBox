import { connectToDatabase } from "@/lib/db/mongodb";
import { Team } from "@/models/Team";
import { verifyAuthToken } from "@/lib/auth/jwt";
import type { AuthenticatedTeam, AuthTokenPayload } from "@/types/auth";

export type AuthenticatedTeamSessionResult =
  | { ok: true; payload: AuthTokenPayload; team: AuthenticatedTeam }
  | { ok: false; reason: "invalid-token" | "team-not-found" };

export async function getAuthenticatedTeamSessionFromToken(
  token: string,
): Promise<AuthenticatedTeamSessionResult> {
  const payload = await verifyAuthToken(token);

  if (!payload) {
    return { ok: false, reason: "invalid-token" };
  }

  await connectToDatabase();

  const team = await Team.findOne({ teamId: payload.teamId })
    .select("teamId teamName currentModule score role module2Data.recoveryKey module3Data.recoveryKey")
    .lean<AuthenticatedTeam | null>();

  if (!team) {
    return { ok: false, reason: "team-not-found" };
  }

  return { ok: true, payload, team };
}

export async function getAuthenticatedTeamFromToken(token?: string): Promise<AuthenticatedTeam | null> {
  if (!token) {
    return null;
  }

  const session = await getAuthenticatedTeamSessionFromToken(token);

  return session.ok ? session.team : null;
}
