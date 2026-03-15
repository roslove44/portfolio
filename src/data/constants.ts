export const SOCIAL_LINKS = {
	github: "https://github.com/roslove44",
	linkedin: "https://www.linkedin.com/in/rostand-migan/",
	x: "https://x.com/migan_rostand",
	email: "hello@rostand.dev",
	gmail: "rostandmigan68@gmail.com"
} as const;

export type Tech = { name: string; key: string };

export const STACK_CATEGORIES: Record<string, Tech[]> = {
	frontend: [
		{ name: "Next.js", key: "nextjs" },
		{ name: "React", key: "react" },
		{ name: "TypeScript", key: "typescript" },
		{ name: "Tailwind CSS", key: "tailwindcss" },
		{ name: "Motion", key: "motion" },
	],
	backend: [
		{ name: "Symfony", key: "symfony" },
		{ name: "Laravel", key: "laravel" },
		{ name: "AdonisJS", key: "adonisjs" },
		{ name: "Node.js", key: "nodejs" },
		{ name: "Go", key: "go" },
		{ name: "Python", key: "python" },
		{ name: "PHP", key: "php" },
		{ name: "API Platform", key: "apiplatform" },
		{ name: "Docker", key: "docker" },
		{ name: "Linux / VPS", key: "linux" },
	],
	database: [
		{ name: "PostgreSQL", key: "postgresql" },
		{ name: "MySQL", key: "mysql" },
		{ name: "SQLite", key: "sqlite" },
		{ name: "Redis", key: "redis" },
		{ name: "MongoDB", key: "mongodb" },
	],
	cms: [
		{ name: "WordPress", key: "wordpress" },
		{ name: "Payload CMS", key: "payloadcms" },
		{ name: "Directus", key: "directus" },
	],
	ai: [
		{ name: "Claude Code", key: "claudecode" },
		{ name: "MCP", key: "mcp" },
	],
	tests: [
		{ name: "Jest", key: "jest" },
		{ name: "Vitest", key: "vitest" },
		{ name: "Playwright", key: "playwright" },
		{ name: "Cypress", key: "cypress" },
	],
	tools: [
		{ name: "Git", key: "git" },
		{ name: "GitHub Actions", key: "githubactions" },
		{ name: "Vercel", key: "vercel" },
		{ name: "Figma", key: "figma" },
		{ name: "VS Code", key: "vscode" },
	],
};
