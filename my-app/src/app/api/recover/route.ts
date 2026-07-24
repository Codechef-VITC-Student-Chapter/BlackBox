import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { owner, repository } = body;

    if (!owner || !repository) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input parameters. Please supply owner and repository."
        },
        { status: 400 }
      );
    }

    const cleanOwner = owner.trim().toLowerCase();
    const cleanRepo = repository.trim().toLowerCase();

    if (cleanOwner === "codechefvit" && cleanRepo === "blackbox") {
      return NextResponse.json({
        success: true,
        url: "https://github.com/codechefvit/blackbox",
        message: "Repository Located. Connecting..."
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Repository Not Found. Try Again."
        },
        { status: 404 }
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
