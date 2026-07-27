import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Problem } from "@/models/Problem";
import { TestCase } from "@/models/TestCase";
import { executeCode } from "@/lib/judge0";
import { getVerdict } from "@/lib/judge";

import { getActiveModuleTeam } from "@/lib/modules/activeModule";
import { jsonError } from "@/lib/http/responses";

export async function POST(req: NextRequest) {
  try {
    const auth = await getActiveModuleTeam(req, 6, "Engineer Certification");
    if (!auth.ok) {
      return jsonError(auth.message, auth.status);
    }

    await connectToDatabase();
    
    const { problem_id, language_id, source_code } = await req.json();

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

    const publicTestCases = await TestCase.find({
      problem_id: problem._id,
      hidden: false,
    })
      .sort({ order: 1 })
      .lean();

    if (publicTestCases.length === 0) {
      return NextResponse.json({ error: "No public test cases found" }, { status: 400 });
    }

    const limits = {
      cpu_time_limit: problem.cpu_time_limit,
      wall_time_limit: problem.wall_time_limit,
      memory_limit: problem.memory_limit / 1024, // Assuming Judge0 takes KB and we store KB? The prompt says "262144" for 256MB. 256 * 1024 = 262144. So our DB is in KB. Judge0 usually takes KB. We'll pass it directly.
    };
    
    limits.memory_limit = problem.memory_limit; // Just passing it straight to Judge0 as it's typically KB.

    const runPromises = publicTestCases.map(async (tc, index) => {
      try {
        const result = await executeCode(
          source_code,
          language_id,
          tc.input,
          tc.expected_output,
          limits
        );

        const verdict = getVerdict(result.status.id);

        return {
          testcase: index + 1,
          passed: verdict === "Accepted",
          verdict,
          time: result.time,
          memory: result.memory,
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          compile_output: result.compile_output || "",
          expected: tc.expected_output,
        };
      } catch (err: any) {
        return {
          testcase: index + 1,
          passed: false,
          verdict: "Internal Error",
          error: err.message,
        };
      }
    });

    const results = await Promise.all(runPromises);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Run error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
