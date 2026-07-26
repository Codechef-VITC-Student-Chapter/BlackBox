import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Problem } from "@/models/Problem";
import { TestCase } from "@/models/TestCase";
import { CodeSubmission } from "@/models/CodeSubmission";
import { executeCode } from "@/lib/judge0";
import { getVerdict, Verdict } from "@/lib/judge";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // In MVP, user_id might be missing or mocked
    const { problem_id, language_id, source_code, user_id = "anonymous" } = await req.json();

    if (!problem_id || !language_id || !source_code) {
      return NextResponse.json(
        { error: "problem_id, language_id, and source_code are required" },
        { status: 400 }
      );
    }

    const problem = await Problem.findById(problem_id).lean();
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const allTestCases = await TestCase.find({
      problem_id: problem._id,
    })
      .sort({ order: 1 })
      .lean();

    if (allTestCases.length === 0) {
      return NextResponse.json({ error: "No test cases found" }, { status: 400 });
    }

    const limits = {
      cpu_time_limit: problem.cpu_time_limit,
      wall_time_limit: problem.wall_time_limit,
      memory_limit: problem.memory_limit,
    };

    const runPromises = allTestCases.map(async (tc) => {
      try {
        const result = await executeCode(
          source_code,
          language_id,
          tc.input,
          tc.expected_output,
          limits
        );
        return {
          tc,
          result,
          verdict: getVerdict(result.status.id)
        };
      } catch (error) {
        return {
          tc,
          result: null,
          verdict: "Internal Error" as Verdict
        };
      }
    });

    const results = await Promise.all(runPromises);

    let finalVerdict: Verdict = "Accepted";
    let passedCount = 0;
    let maxTime = 0;
    let maxMemory = 0;
    let firstFailedTest = -1;

    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      
      if (res.result) {
        const timeVal = parseFloat(res.result.time || "0");
        const memoryVal = res.result.memory || 0;
        if (timeVal > maxTime) maxTime = timeVal;
        if (memoryVal > maxMemory) maxMemory = memoryVal;
      }

      if (res.verdict === "Accepted") {
        passedCount++;
      } else if (finalVerdict === "Accepted") {
        finalVerdict = res.verdict;
        firstFailedTest = i + 1;
      }
    }

    // Save the submission
    const submission = await CodeSubmission.create({
      user_id,
      problem_id: problem._id,
      language_id,
      source_code,
      status: finalVerdict,
      passed: passedCount,
      total: allTestCases.length,
      time: maxTime,
      memory: maxMemory,
    });

    // Return the response (hiding test case details, except maybe the number)
    return NextResponse.json({
      submission_id: submission._id,
      verdict: finalVerdict,
      passed: passedCount,
      total: allTestCases.length,
      time: maxTime,
      memory: maxMemory,
      message: finalVerdict === "Accepted" 
        ? "Accepted" 
        : `Failed on Testcase #${firstFailedTest} (${finalVerdict})`
    });
  } catch (error: any) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
