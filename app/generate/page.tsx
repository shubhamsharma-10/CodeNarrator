"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Github, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";


function isValidGitHubUrl(url:  string): boolean {
  // Fixed regex - now accepts usernames with hyphens and various repo names
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\/[a-zA-Z0-9._-]+\/?$/;
  return githubRegex. test(url. trim());
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const cleanUrl = url.trim().replace(/\/$/, "");
    const urlObj = new URL(cleanUrl);
    const parts = urlObj.pathname.split("/").filter(Boolean);
    
    if (parts.length >= 2) {
      return {
        owner:  parts[0],
        repo: parts[1].replace(/\.git$/, ""),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default function GeneratePage() {
  const [url, setUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e. target.value;
    setUrl(value);
    setError(null);
    
    if (! value.trim()) {
      setValidationStatus("idle");
      setRepoInfo(null);
      return;
    }

    if (isValidGitHubUrl(value)) {
      const parsed = parseGitHubUrl(value);
      setRepoInfo(parsed);
      setValidationStatus("valid");
    } else {
      setValidationStatus("invalid");
      setRepoInfo(null);
    }
  };

const handleSubmit = async (e: React. FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!isValidGitHubUrl(url)) {
    setError("Please enter a valid GitHub repository URL");
    return;
  }

   const parsed = parseGitHubUrl(url);
  if (!parsed) {
    setError("Please enter a valid GitHub repository URL");
    return;
  }


  setIsValidating(true);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type":  "application/json" },
      body:  JSON.stringify({
        owner:  parsed.owner,
        repo: parsed.repo,
      }),
    });

    const raw = await response.text();
    const data = raw ?  (() => { try { return JSON. parse(raw); } catch { return { error: raw }; } })() : {};

    if (!response.ok) {
      throw new Error(data.error || "Failed to analyze repository");
    }

    // For now, log the data - we'll use this in the next issue
   if (process.env. NODE_ENV !== "production") {
  console.log("Repository Analysis:", data);
}
    
    // Store in sessionStorage for the next page (we'll build this later)
    sessionStorage.setItem("repoAnalysis", JSON.stringify(data));
    
    alert(`✅ Successfully analyzed ${data.metadata.fullName}!\n\n` +
      `⭐ Stars: ${data.metadata.stars}\n` +
      `📁 Files: ${data.files.length}\n` +
      `💻 Languages: ${Object.keys(data.languages).join(", ")}\n\n` +
      `Next step: Generate documentation (coming in Issue #4)`);

  } catch (err) {
    const message = err instanceof Error ?  err.message : "Failed to analyze repository";
    setError(message);
  } finally {
    setIsValidating(false);
  }
};


  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setError(null);
    const parsed = parseGitHubUrl(exampleUrl);
    setRepoInfo(parsed);
    setValidationStatus("valid");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <a
          href="https://github.com/shubhamsharma-10/CodeNarrator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Github className="w-6 h-6" />
        </a>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-4">
              Generate Documentation
            </h1>
            <p className="text-slate-400 text-lg">
              Paste a GitHub repository URL and let AI create beautiful docs for you
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <Github className="w-5 h-5" />
                Repository URL
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Enter the URL of any public GitHub repository
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://github.com/owner/repository"
                    value={url}
                    onChange={handleUrlChange}
                    className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 pr-10 h-12 text-lg ${
                      validationStatus === "valid"
                        ? "border-green-500 focus-visible:ring-green-500"
                        : validationStatus === "invalid"
                        ?  "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    disabled={isValidating}
                  />
                  {/* Validation Icon */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {validationStatus === "valid" && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {validationStatus === "invalid" && url. trim() && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Validation Messages - Only show ONE message at a time */}
                {error ?  (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                ) : validationStatus === "valid" && repoInfo ? (
                  <p className="text-green-400 text-sm flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Valid repository:  {repoInfo. owner}/{repoInfo.repo}
                  </p>
                ) : validationStatus === "invalid" && url.trim() ? (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Please enter a valid GitHub URL (e.g., https://github.com/owner/repo)
                  </p>
                ) : null}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-12"
                disabled={validationStatus !== "valid" || isValidating}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Repository...
                  </>
                ) : (
                  <>
                    Generate Documentation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Example URLs */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm mb-3">Try with these examples:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "https://github.com/vercel/next.js",
                "https://github.com/facebook/react",
                "https://github.com/shubhamsharma-10/CodeNarrator",
              ].map((exampleUrl) => (
                <button
                  key={exampleUrl}
                  type="button"
                  onClick={() => handleExampleClick(exampleUrl)}
                  className="text-xs bg-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  {exampleUrl. replace("https://github.com/", "")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}