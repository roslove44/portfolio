import type { Project } from "@/types/project";
export type { Project, ProjectType } from "@/types/project";
export { PROJECT_TYPES } from "@/types/project";

export const HIGHLIGHTED_PROJECTS: Project[] = [
	{
		key: "comptaopen",
		type: "saas",
		featured: true,
		date: "2026-01-01",
		stack: ["Next.js", "TypeScript", "AdonisJS", "PostgreSQL", "Docker", "Gotenberg", "TipTap"],
		cover: "cover.webp",
		video: "", // test video done, will replace with a proper demo once I have one
	},
	{
		key: "gestiloc",
		type: "saas",
		featured: true,
		date: "2026-01-26",
		live: "https://gestiloc.io",
		stack: ["Next.js", "Supabase", "TypeScript", "TipTap", "Shadcn/ui"],
		cover: "cover.webp",
		owner: { name: "Marius DJENONTIN", url: "https://github.com/mariusdjen", social: "github" }
	},
	{
		key: "gmaps-scraper",
		type: "tool",
		featured: true,
		date: "2025-01-13",
		stack: ["Python", "Selenium", "BeautifulSoup"],
		github: "https://github.com/roslove44/GoogleMapsScrape",
		cover: "cover.webp",
	},
];

export const PROJECTS: Project[] = [
	...HIGHLIGHTED_PROJECTS,
	// More projects here
];
