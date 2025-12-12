import { NextRequest, NextResponse } from "next/server";
import { analyzeRepository } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { owner, repo } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { error:  "Missing owner or repo parameter" },
        { status: 400 }
      );
    }

    const analysis = await analyzeRepository(owner, repo);

    return NextResponse. json(analysis);
  } catch (error) {
    console.error("Repository analysis error:", error);

    const message = error instanceof Error ?  error.message : "Failed to analyze repository";

    return NextResponse. json(
      { error: message },
      { status: 500 }
    );
  }
}