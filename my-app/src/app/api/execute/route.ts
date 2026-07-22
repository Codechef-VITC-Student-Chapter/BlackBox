import { NextRequest, NextResponse } from "next/server";
import { executeCode } from "@/lib/judge0";

const LANGUAGE_MAP: Record<string, number> = {
  cpp: 54,
  java: 62,
  python: 71,
  go: 60,
};

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const languageId = LANGUAGE_MAP[language];
    if (!languageId) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    const result = await executeCode(code, languageId);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Execution error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute code" },
      { status: 500 }
    );
  }
}
