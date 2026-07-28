import { NextResponse, type NextRequest } from "next/server";
import { adminAuthorizationError, getAdminAuthorizationFromRequest } from "@/lib/auth/admin";
import { getLeaderboard } from "@/lib/scoring/ctfd";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAdminAuthorizationFromRequest(request);
    if (!auth.ok) return adminAuthorizationError(auth);

    const leaderboard = await getLeaderboard();
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard." },
      { status: 500 }
    );
  }
}
