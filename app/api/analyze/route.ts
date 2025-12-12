import { NextRequest, NextResponse } from "next/server";
import { analyzeRepository } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    let body:  unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status:  400 });
    }
    
    const { owner, repo } = (body ??  {}) as { owner?:  unknown; repo?: unknown };

    if (typeof owner !== "string" || typeof repo !== "string" || ! owner || !repo) {
      return NextResponse.json(
        { error:  "Missing owner or repo parameter" },
        { status: 400 }
      );
    }

    const analysis = await analyzeRepository(owner, repo);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Repository analysis error:", error);

    const message = error instanceof Error ?  error.message : "Failed to analyze repository";
    
    const status =
      /not found/i.test(message) ? 404 : 
      /rate limit/i.test(message) ? 429 :
      500;
      
    return NextResponse.json({ error: message }, { status });
  }
}