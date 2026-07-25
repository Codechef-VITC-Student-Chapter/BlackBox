import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Problem } from "@/models/Problem";
import { TestCase } from "@/models/TestCase";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const problem = await Problem.findById(id).lean();
    if (!problem) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    const testcases = await TestCase.find({ problem_id: id }).sort({ order: 1 }).lean();
    
    return NextResponse.json({ problem, testcases });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    
    const problem = await Problem.findByIdAndUpdate(id, body.problem, { new: true });
    
    // For testcases, a simple approach is to delete all and insert the new ones
    if (body.testcases && Array.isArray(body.testcases)) {
      await TestCase.deleteMany({ problem_id: id });
      const tcs = body.testcases.map((tc: any, index: number) => ({
        ...tc,
        problem_id: id,
        order: index,
      }));
      if (tcs.length > 0) {
        await TestCase.insertMany(tcs);
      }
    }
    
    return NextResponse.json({ success: true, problem });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Problem.findByIdAndDelete(id);
    await TestCase.deleteMany({ problem_id: id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
