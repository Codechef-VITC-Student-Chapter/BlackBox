import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { masterKey } = body;

    if (!masterKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Master Key is required."
        },
        { status: 400 }
      );
    }

    const cleanKey = masterKey.trim().toUpperCase();

    // Simulated expected key for the 9 PM showcase
    const MOD2_STATIC_KEY = "RX-7F21-884-PRODUCTION";
    const simulatedMod3Key = "NX-V3-HTTP2-PRODUCTION";
    const simulatedMod4Key = "FRAGMENT_D";
    const expectedMasterKey = `${MOD2_STATIC_KEY}${simulatedMod3Key}${simulatedMod4Key}`;

    if (cleanKey === expectedMasterKey.toUpperCase()) {
      return NextResponse.json({
        success: true,
        nextModule: "/final-authorization"
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "CRITICAL MISALIGNMENT: Integrity Check Failed."
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error parsing request."
      },
      { status: 500 }
    );
  }
}