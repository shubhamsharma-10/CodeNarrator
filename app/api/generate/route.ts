import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

// Create OpenRouter provider using Vercel AI SDK's OpenAI adapter
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process. env.OPENROUTER_API_KEY! ,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoAnalysis, docType } = body;

    if (!repoAnalysis) {
      return new Response(JSON.stringify({ error: "Missing repository analysis" }), {
        status: 400,
        headers:  { "Content-Type": "application/json" },
      });
    }

    const prompt = buildPrompt(repoAnalysis, docType);

    // Pass the model from the provider, not a string
    const result = streamText({
      model: openrouter("meta-llama/llama-3.2-3b-instruct:free"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Generation error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate documentation" }), {
      status:  500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function buildPrompt(repoAnalysis: any, docType: string): string {
  const { metadata, files, languages, keyFiles } = repoAnalysis;

  const baseContext = `
You are an expert technical writer. Generate professional documentation for this GitHub repository. 

## Repository Information
- **Name:** ${metadata.fullName}
- **Description:** ${metadata. description || "No description provided"}
- **Primary Language:** ${metadata.language || "Not specified"}
- **Stars:** ${metadata. stars} | **Forks:** ${metadata.forks}
- **License:** ${metadata.license || "Not specified"}
- **Topics:** ${metadata.topics?. join(", ") || "None"}

## Languages Used
${Object.entries(languages).map(([lang, percent]) => `- ${lang}: ${percent}%`).join("\n")}

## Project Structure (Key Files)
${files.slice(0, 50).map((f: any) => `- ${f.path}`).join("\n")}

## Existing Files Content
${Object.entries(keyFiles).map(([name, content]) => `### ${name}\n\`\`\`\n${(content as string).slice(0, 2000)}\n\`\`\``).join("\n\n")}
`;

  const prompts: Record<string, string> = {
    readme: `${baseContext}

## Task
Generate a comprehensive README.md file that includes:
1. Project title with emoji and badges
2. Clear description of what the project does
3. Key features list with emojis
4. Tech stack table
5. Quick start / Installation guide
6. Usage examples with code snippets
7. Project structure overview
8. Contributing guidelines summary
9. License information

Make it visually appealing with proper markdown formatting.
Output ONLY the markdown content, no explanations. `,

    installation: `${baseContext}

## Task
Generate a detailed INSTALLATION. md guide that includes: 
1. Prerequisites (Node version, dependencies, etc.)
2. Step-by-step installation instructions
3. Environment variables setup
4. Running in development mode
5. Running in production mode
6. Common installation issues and solutions

Be specific based on the detected tech stack. 
Output ONLY the markdown content, no explanations. `,

    api: `${baseContext}

## Task
Generate API documentation that includes: 
1. API Overview
2. Base URL and authentication
3. Available endpoints (infer from code structure)
4. Request/Response formats with examples
5. Error codes and handling
6. Code examples (curl, JavaScript, Python)

Format as a clean API reference document.
Output ONLY the markdown content, no explanations.`,

    contributing: `${baseContext}

## Task
Generate a CONTRIBUTING.md guide that includes:
1. Welcome message for contributors
2. Code of Conduct reference
3. How to report bugs
4. How to suggest features
5. Development setup instructions
6. Pull request process
7. Commit message conventions

Make it welcoming and clear. 
Output ONLY the markdown content, no explanations.`,
  };

  return prompts[docType] || prompts.readme;
}