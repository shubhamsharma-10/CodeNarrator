import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Github, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-500" />
           <span className="text-xl font-bold text-white">CodeNarrator</span>
        </div>
        <a
          href="https://github.com/shubhamsharma-10/CodeNarrator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Github className="w-6 h-6" />
        </a>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-sm text-slate-300 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Powered by Vercel AI SDK + Google Gemini
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Any Repo Into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {" "}Beautiful Docs
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            CodeNarrator analyzes your GitHub repository and generates
            professional documentation in seconds.  README, API docs,
            setup guides — all with one click.
          </p>

          {/* CTA Button */}
          <Link href="/generate">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              Generate Docs Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          {/* Social Proof */}
          <p className="text-slate-500 mt-6 text-sm">
            ✨ Free to use • No sign-up required • Works with any public repo
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Github className="w-8 h-8" />}
            title="Any GitHub Repo"
            description="Just paste a GitHub URL and let AI analyze your entire codebase structure"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Instant Generation"
            description="Get professional documentation in seconds with real-time streaming AI"
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8" />}
            title="Multiple Formats"
            description="README, API docs, setup guides, and contribution guidelines"
          />
        </div>

        {/* How it Works */}
        <div className="mt-32 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step="1"
              title="Paste Repo URL"
              description="Enter any public GitHub repository URL"
            />
            <StepCard
              step="2"
              title="AI Analyzes"
              description="Our AI scans your code structure and dependencies"
            />
            <StepCard
              step="3"
              title="Get Docs"
              description="Download beautiful, professional documentation"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-slate-800 mt-20">
        <div className="text-center text-slate-500 text-sm">
          Built with ❤️ for WeMakeDevs Hackathon by{" "}
          <a
            href="https://github.com/shubhamsharma-10"
            className="text-blue-400 hover:underline"
          >
            Shubham Sharma
          </a>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center hover:border-slate-600 transition-colors">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4 text-blue-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}:  {
  step:  string;
  title:  string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4 text-white font-bold text-xl">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}