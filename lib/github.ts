const GITHUB_API_BASE = "https://api.github.com";

interface RepoMetadata {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  homepage: string | null;
  license: string | null;
}

interface FileNode {
  name: string;
  path: string;
  type: "file" | "dir";
  size?:  number;
}

interface LanguageBreakdown {
  [language: string]: number;
}

interface RepoAnalysis {
  metadata: RepoMetadata;
  files:  FileNode[];
  languages: LanguageBreakdown;
  keyFiles: { [filename: string]: string };
}

// Helper to create headers
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "CodeNarrator",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

// Fetch repository metadata
export async function getRepoMetadata(owner: string, repo: string): Promise<RepoMetadata> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found.  Make sure it's a public repository.");
    }
    if (response.status === 403) {
      throw new Error("API rate limit exceeded. Please try again later.");
    }
    throw new Error(`Failed to fetch repository: ${response. statusText}`);
  }

  const data = await response. json();

  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    topics: data.topics || [],
    defaultBranch: data. default_branch,
    createdAt:  data.created_at,
    updatedAt: data.updated_at,
    homepage: data.homepage,
    license:  data.license?. name || null,
  };
}

// Fetch file tree
export async function getFileTree(owner: string, repo: string, branch: string): Promise<FileNode[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}? recursive=1`,
    { headers: getHeaders() }
  );

  if (!response. ok) {
    throw new Error(`Failed to fetch file tree:  ${response.statusText}`);
  }

  const data = await response.json();

  return data.tree
    .filter((item: { type: string }) => item.type === "blob" || item.type === "tree")
    .slice(0, 100) // Limit to 100 files to avoid overwhelming the AI
    .map((item: { path:  string; type: string; size?: number }) => ({
      name:  item.path. split("/").pop() || item.path,
      path: item.path,
      type: item.type === "blob" ? "file" : "dir",
      size:  item.size,
    }));
}

// Fetch languages
export async function getLanguages(owner: string, repo: string): Promise<LanguageBreakdown> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    return {};
  }

  const data = await response.json();

  // Convert bytes to percentages
  const total = Object.values(data).reduce((sum:  number, bytes) => sum + (bytes as number), 0);

  const percentages: LanguageBreakdown = {};
  for (const [lang, bytes] of Object.entries(data)) {
    percentages[lang] = Math.round(((bytes as number) / total) * 100 * 10) / 10;
  }

  return percentages;
}

// Fetch file content
export async function getFileContent(owner:  string, repo: string, path: string): Promise<string | null> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
    headers:  getHeaders(),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (data. encoding === "base64" && data.content) {
    return Buffer. from(data.content, "base64").toString("utf-8");
  }

  return null;
}

// Main function to analyze a repository
export async function analyzeRepository(owner: string, repo:  string): Promise<RepoAnalysis> {
  // Fetch metadata first
  const metadata = await getRepoMetadata(owner, repo);

  // Fetch files, languages, and key files in parallel
  const [files, languages] = await Promise.all([
    getFileTree(owner, repo, metadata.defaultBranch),
    getLanguages(owner, repo),
  ]);

  // Fetch key files content
  const keyFileNames = ["README.md", "readme.md", "package.json", "requirements.txt", "Cargo.toml", "go.mod"];
  const keyFiles:  { [filename: string]: string } = {};

  for (const fileName of keyFileNames) {
    const fileExists = files.some((f) => f.path. toLowerCase() === fileName.toLowerCase());
    if (fileExists) {
      const content = await getFileContent(owner, repo, fileName);
      if (content) {
        keyFiles[fileName] = content. slice(0, 5000); // Limit content size
      }
    }
  }

  return {
    metadata,
    files,
    languages,
    keyFiles,
  };
}