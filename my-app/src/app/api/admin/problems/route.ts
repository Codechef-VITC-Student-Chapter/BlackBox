import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Problem } from "@/models/Problem";

export async function GET() {
  try {
    await connectToDatabase();
    const problems = await Problem.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(problems);
  } catch (error: any) {
    console.error("GET admin problems error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const problem = await Problem.create(body);
    return NextResponse.json(problem);
  } catch (error: any) {
    console.error("POST admin problems error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
