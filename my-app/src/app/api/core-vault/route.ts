import { NextResponse, type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { completeModule, unlockNextModule } from "@/engine/gameEngine";
import { getAuthenticatedTeamSessionFromToken } from "@/lib/auth/session";

export const runtime = "nodejs";

const MODULE_NUMBER = 5;

function coreVaultError(message: string, status: number): NextResponse {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { masterKey } = body;

    if (!masterKey) {
      return coreVaultError("Master Key is required.", 400);
    }

    const token = request.cookies.get(GAME_CONFIG.authCookieName)?.value;

    if (!token) {
      return coreVaultError("Unauthenticated.", 401);
    }

    const authSession = await getAuthenticatedTeamSessionFromToken(token);

    if (!authSession.ok && authSession.reason === "invalid-token") {
      return coreVaultError("Unauthenticated.", 401);
    }

    if (!authSession.ok) {
      return coreVaultError("Team not found.", 401);
    }

    if (authSession.payload.teamId !== authSession.team.teamId) {
      return coreVaultError("Unauthenticated.", 401);
    }

    if (authSession.team.currentModule !== MODULE_NUMBER) {
      return coreVaultError("Core Vault is not currently active for your team.", 403);
    }

    const module2Key = authSession.team.module2Data?.recoveryKey;
    const module3Key = authSession.team.module3Data?.recoveryKey;

    if (!module2Key) {
      return coreVaultError("Module 2 recovery key not found.", 404);
    }

    if (!module3Key) {
      return coreVaultError("Module 3 recovery key not found.", 404);
    }

    const expectedMasterKey = `${module2Key}${module3Key}`;
    const cleanSubmittedKey = masterKey.trim().toUpperCase();

    if (cleanSubmittedKey === expectedMasterKey.toUpperCase()) {
      await completeModule(authSession.team.teamId, MODULE_NUMBER);
      await unlockNextModule(authSession.team.teamId);

      return NextResponse.json({
        success: true,
        nextModule: "/engineer-certification"
      });
    } else {
      return coreVaultError("CRITICAL MISALIGNMENT: Integrity Check Failed.", 400);
    }
  } catch (error) {
    console.error("Core Vault API Error:", error);
    return coreVaultError("Server error processing request!", 500);
  }
}
