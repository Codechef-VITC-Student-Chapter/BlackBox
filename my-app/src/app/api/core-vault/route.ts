import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Progress } from "@/models/Progress";

export const runtime = "nodejs";

const MOD2_STATIC_KEY = "RX-7F21-884-PRODUCTION";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { masterKey } = body;

    if (!masterKey) {
      return NextResponse.json({ success: false, message: "Master Key is required." }, { status: 400 });
    }

    // 1. Connect to the database
    await connectToDatabase();

    // 2. Set up Dummy Team Data for Testing
    const dummyTeamId = "TEST-TEAM-001";
    
    // Check if dummy team exists, if not, create it
    let teamProgress = await Progress.findOne({ teamId: dummyTeamId });
    if (!teamProgress) {
      teamProgress = await Progress.create({
        teamId: dummyTeamId,
        module: 5,
        completed: false,
        attempts: 0,
      });
      console.log("Created dummy database entry for testing!");
    }

    // 3. Construct Expected Key from Database Document
    const expectedMasterKey = `${MOD2_STATIC_KEY}${teamProgress.mod3Key}${teamProgress.mod4Key}`;
    const cleanSubmittedKey = masterKey.trim().toUpperCase();

    // 4. Final Validation Check
    if (cleanSubmittedKey === expectedMasterKey.toUpperCase()) {
      return NextResponse.json({
        success: true,
        nextModule: "/final-authorization"
      });
    } else {
      return NextResponse.json(
        { success: false, message: "CRITICAL MISALIGNMENT: Integrity Check Failed." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Core Vault API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error processing request!" },
      { status: 500 }
    );
  }
}