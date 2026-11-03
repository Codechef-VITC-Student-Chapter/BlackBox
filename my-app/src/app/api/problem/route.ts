import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Problem } from "@/models/Problem";

export async function GET() {
  try {
    await connectToDatabase();

    const problems = await Problem.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(problems);
  } catch (error: any) {
    console.error("GET published problems error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
