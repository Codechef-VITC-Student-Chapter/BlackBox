import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { recoveryKey } = body;

    if (!recoveryKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Recovery Key is required."
        },
        { status: 400 }
      );
    }

    const cleanKey = recoveryKey.trim().toUpperCase();

    if (cleanKey === "BBX-RECOVERY-9X41A") {
      return NextResponse.json({
        success: true,
        nextModule: "/network-labyrinth"
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Recovery Key"
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
