import { NextRequest, NextResponse } from "next/server";
import { adminAuthorizationError, getAdminAuthorizationFromRequest } from "@/lib/auth/admin";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Problem } from "@/models/Problem";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAdminAuthorizationFromRequest(req);
    if (!auth.ok) return adminAuthorizationError(auth);

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
    const auth = await getAdminAuthorizationFromRequest(req);
    if (!auth.ok) return adminAuthorizationError(auth);

    await connectToDatabase();
    const body = await req.json();
    const problem = await Problem.create(body);
    return NextResponse.json(problem);
  } catch (error: any) {
    console.error("POST admin problems error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
