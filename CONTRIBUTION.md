# 🤝 Contributing to CodeNarrator

Thank you for your interest in contributing to CodeNarrator! This document provides guidelines and steps for contributing. 

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Development Workflow](#-development-workflow)
- [Pull Request Process](#-pull-request-process)
- [Style Guidelines](#-style-guidelines)
- [Commit Message Convention](#-commit-message-convention)
- [Need Help?](#-need-help)

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for everyone.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed: 

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Git**

### Fork and Clone

1. **Fork** the repository by clicking the "Fork" button on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CodeNarrator.git
   cd CodeNarrator
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/shubhamsharma-10/CodeNarrator.git
   ```

## 💻 Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your API keys:
   ```dotenv
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔄 Development Workflow

1. **Sync with upstream:**
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a new branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
   
   Branch naming convention: 
   - `feat/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation changes
   - `refactor/` - Code refactoring
   - `test/` - Adding tests
   - `chore/` - Maintenance tasks

3. **Make your changes** and test thoroughly

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Pull Request Process

1. **Before submitting:**
   - Ensure your code follows the style guidelines
   - Test your changes locally
   - Update documentation if needed
   - Make sure there are no linting errors (`npm run lint`)

2. **PR Title:** Use a clear, descriptive title following commit conventions
   ```
   feat: add GitHub repository input component
   fix: resolve markdown preview rendering issue
   docs: update installation instructions
   ```

3. **PR Description:** Fill out the PR template completely:
   - Describe what changes you made
   - Link related issues (use `Closes #123`)
   - Add screenshots for UI changes

4. **Code Review:**
   - Wait for CodeRabbit automated review
   - Address any feedback or suggestions
   - Respond to reviewer comments
   - Make requested changes in new commits

5. **Merging:**
   - PRs require at least one approval
   - All CI checks must pass
   - Squash and merge is preferred

## 🎨 Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type
- Use meaningful variable and function names

```typescript
// ✅ Good
interface RepoData {
  name: string;
  description: string;
  stars: number;
}

const fetchRepositoryData = async (url: string): Promise<RepoData> => {
  // implementation
};

// ❌ Bad
const getData = async (x:  any): Promise<any> => {
  // implementation
};
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
};
```

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use shadcn/ui components when possible
- Keep custom CSS minimal

### File Organization

```
app/
├── api/          # API routes
├── (routes)/     # Page routes
├── layout.tsx    # Root layout
└── page.tsx      # Home page

components/
├── ui/           # shadcn/ui components
└── features/     # Feature-specific components

lib/
└── utils. ts      # Utility functions
```

## 💬 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |

### Examples

```bash
feat: add GitHub repository URL validation
fix:  resolve streaming response timeout issue
docs:  update API documentation
refactor: simplify markdown parsing logic
chore:  update dependencies to latest versions
```

## ❓ Need Help? 

- **Questions?** Open a [GitHub Issue](https://github.com/shubhamsharma-10/CodeNarrator/issues/new)
- **Discussions?** Start a [GitHub Discussion](https://github.com/shubhamsharma-10/CodeNarrator/discussions)
- **Contact:** Reach out to [@shubhamsharma-10](https://github.com/shubhamsharma-10)

## 🙏 Thank You!

Thank you for contributing to CodeNarrator! Your efforts help make this project better for everyone. 

---

Built with ❤️ by the CodeNarrator community