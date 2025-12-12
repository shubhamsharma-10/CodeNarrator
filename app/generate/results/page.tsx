"use client";

import { useState, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Download, Check, Loader2, FileText, Book, Code, Users, Eye, FileCode } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";

const DOC_TYPES = [
  { id: "readme", label: "README", icon: FileText, description: "Project overview & quick start" },
  { id: "installation", label: "Installation", icon: Book, description: "Setup & configuration guide" },
  { id: "api", label: "API Docs", icon: Code, description: "API reference & examples" },
  { id: "contributing", label: "Contributing", icon: Users, description: "Contribution guidelines" },
];

export default function ResultsPage() {
  const [repoAnalysis, setRepoAnalysis] = useState<any>(null);
  const [selectedDocType, setSelectedDocType] = useState("readme");
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/generate",
    streamProtocol: "text",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("repoAnalysis");
    if (stored) {
      setRepoAnalysis(JSON.parse(stored));
    }
  }, []);

  const handleGenerate = async () => {
    if (!repoAnalysis) return;
    setGenerated(true);
    await complete("", {
      body: {
        repoAnalysis,
        docType: selectedDocType,
      },
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([completion], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDocType.toUpperCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!repoAnalysis) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No repository data found</p>
          <Link href="/generate">
            <Button>Go Back</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-slate-800">
        <Link href="/generate" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <div className="text-white font-semibold">
          {repoAnalysis.metadata.fullName}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Doc Type Selection */}
          <div className="lg: col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Documentation Type</h3>
              <div className="space-y-2">
                {DOC_TYPES.map((docType) => {
                  const Icon = docType.icon;
                  return (
                    <button
                      key={docType.id}
                      onClick={() => {
                        setSelectedDocType(docType.id);
                        setGenerated(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${selectedDocType === docType.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{docType.label}</div>
                          <div className="text-xs opacity-70">{docType.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Documentation"
                )}
              </Button>
            </div>

            {/* Repo Stats */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mt-4">
              <h3 className="text-white font-semibold mb-3">Repository Stats</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Stars</span>
                  <span className="text-white">{repoAnalysis.metadata.stars}</span>
                </div>
                <div className="flex justify-between">
                  <span>Forks</span>
                  <span className="text-white">{repoAnalysis.metadata.forks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language</span>
                  <span className="text-white">{repoAnalysis.metadata.language || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>License</span>
                  <span className="text-white">{repoAnalysis.metadata.license || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Generated Documentation */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-white font-semibold">
                  {DOC_TYPES.find((d) => d.id === selectedDocType)?.label} Preview
                </h2>
                <div className="flex gap-2">
                  {/* View Mode Toggle */}
                  {completion && (
                    <>
                      <div className="flex bg-slate-700 rounded-lg p-1 mr-2">
                        <button
                          onClick={() => setViewMode("preview")}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === "preview"
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:text-white"
                            }`}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => setViewMode("raw")}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === "raw"
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:text-white"
                            }`}
                        >
                          <FileCode className="w-4 h-4" />
                          Raw
                        </button>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 min-h-[500px]">
                {!generated && !completion && (
                  <div className="flex items-center justify-center h-96 text-slate-500">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a documentation type and click "Generate"</p>
                    </div>
                  </div>
                )}

                {isLoading && !completion && (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                      <p className="text-slate-400">AI is writing your documentation...</p>
                    </div>
                  </div>
                )}

                {completion && viewMode === "raw" && (
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono bg-slate-900 p-4 rounded-lg overflow-auto">
                    {completion}
                  </pre>
                )}

                {completion && viewMode === "preview" && (
                  <div className="markdown-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {completion}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}