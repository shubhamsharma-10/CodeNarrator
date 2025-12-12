# 🤖 RepoDoc AI

> Turn any GitHub repository into beautiful documentation in seconds! 

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://repodoc-ai.vercel.app)
[![CodeRabbit](https://img.shields.io/badge/Code%20Review-CodeRabbit-blue)](https://coderabbit.ai)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)

## ✨ Features

- 🔗 **Any GitHub Repo** - Just paste a URL
- 🤖 **AI-Powered** - Uses Google Gemini via Vercel AI SDK
- ⚡ **Instant Generation** - Real-time streaming responses
- 📄 **Multiple Doc Types** - README, API docs, setup guides
- 📤 **Easy Export** - Download or copy to clipboard
- 🌙 **Beautiful UI** - Dark mode, responsive design

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **AI** | Vercel AI SDK + Google Gemini |
| **Deployment** | Vercel |
| **Code Review** | CodeRabbit |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API Key (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/shubhamsharma-10/repodoc-ai. git
cd repodoc-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env. local
# Edit .env. local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | ✅ Yes |
| `GITHUB_TOKEN` | GitHub personal access token | ❌ Optional |

## 📁 Project Structure

```
repodoc-ai/
├── app/
│   ├── api/
│   │   ├── analyze/      # GitHub repo analysis
│   │   └── generate/     # AI doc generation
│   ├── generate/         # Generation page
│   ├── layout.tsx
│   ├── page.tsx          # Landing page
│   └── globals.css
├── components/
│   ├── ui/               # shadcn components
│   └── features/         # Custom components
├── lib/
└── public/
```

## 🎯 How It Works

1. **Paste** any public GitHub repository URL
2. **AI analyzes** the codebase structure, dependencies, and patterns
3. **Generate** professional documentation instantly
4. **Export** as Markdown or copy to clipboard

## 📝 License

MIT License - feel free to use this project! 

---

Built with ❤️ for [WeMakeDevs Hackathon](https://wemakedevs. org) by [Shubham Sharma](https://github.com/shubhamsharma-10)