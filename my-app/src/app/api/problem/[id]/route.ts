import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Problem } from "@/models/Problem";
import { TestCase } from "@/models/TestCase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // We need to await params in Next.js 15+ if it's considered a Promise, but typically in older versions it's synchronous. Let's assume params is standard. 
    // The prompt is Next.js 14/15. Wait, in Next.js 15, `params` is a Promise. We'll await it to be safe.
    const { id } = await params;

    const problem = await Problem.findOne({ slug: id }).lean() || await Problem.findById(id).lean();

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const publicTestCases = await TestCase.find({
      problem_id: problem._id,
      hidden: false,
    })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({
      problem,
      testcases: publicTestCases,
    });
  } catch (error: any) {
    console.error("GET problem error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
