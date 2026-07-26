import { NextResponse, type NextRequest } from "next/server";
import { GAME_CONFIG } from "@/config/game";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getAuthenticatedTeamSessionFromToken } from "@/lib/auth/session";
import { hasCompletedModule } from "@/lib/modules/progress";
import { Progress } from "@/models/Progress";

export const runtime = "nodejs";

const MOD2_STATIC_KEY = "RX-7F21-884-PRODUCTION";
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

    const previousModulesCompleted = await Promise.all(
      [1, 2, 3, 4].map((moduleNumber) => hasCompletedModule(authSession.team.teamId, moduleNumber)),
    );

    if (previousModulesCompleted.some((completed) => !completed)) {
      return coreVaultError("Previous modules have not been completed.", 403);
    }

    await connectToDatabase();

    const teamProgress = await Progress.findOne({ teamId: authSession.team.teamId, module: MODULE_NUMBER })
      .select("mod3Key mod4Key")
      .lean<{ mod3Key?: string | null; mod4Key?: string | null } | null>();

    if (!teamProgress) {
      return coreVaultError("Progress not found.", 404);
    }

    if (!teamProgress.mod3Key) {
      return coreVaultError("Module 3 recovery key not found.", 404);
    }

    if (!teamProgress.mod4Key) {
      return coreVaultError("Module 4 recovery key not found.", 404);
    }

    const expectedMasterKey = `${MOD2_STATIC_KEY}${teamProgress.mod3Key}${teamProgress.mod4Key}`;
    const cleanSubmittedKey = masterKey.trim().toUpperCase();

    if (cleanSubmittedKey === expectedMasterKey.toUpperCase()) {
      return NextResponse.json({
        success: true,
        nextModule: "/final-authorization"
      });
    } else {
      return coreVaultError("CRITICAL MISALIGNMENT: Integrity Check Failed.", 400);
    }
  } catch (error) {
    console.error("Core Vault API Error:", error);
    return coreVaultError("Server error processing request!", 500);
  }
}
