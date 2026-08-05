import type { Project } from "@/types/project";
export type { Project, ProjectType } from "@/types/project";
export { PROJECT_TYPES } from "@/types/project";

export const HIGHLIGHTED_PROJECTS: Project[] = [
	{
		key: "brand-artisan",
		type: "tool",
		featured: true,
		date: "2026-06-26",
		stack: ["TypeScript", "React", "Satori", "resvg", "Node.js"],
		github: "https://github.com/roslove44/brand-artisan",
		live: "https://www.npmjs.com/package/brand-artisan",
		blog: "brand-artisan-jsx-to-image",
		cover: "cover.png",
	},
	{
		key: "comptaopen",
		type: "saas",
		status: "in-progress",
		featured: true,
		date: "2026-01-01",
		stack: ["Next.js", "TypeScript", "AdonisJS", "PostgreSQL", "Docker", "Gotenberg", "TipTap"],
		cover: "cover.webp",
		video: "", // test video done, will replace with a proper demo once I have one
	},
	{
		key: "bailto",
		type: "saas",
		featured: true,
		date: "2026-01-26",
		live: "https://bailto.com",
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
	{
		key: "lemarchedelacom",
		type: "website",
		featured: false,
		date: "2024-10-27",
		live: "https://lemarchedelacom.fr",
		stack: ["WordPress"],
		cover: "cover.webp",
	},
	{
		key: "fmcbenin",
		type: "website",
		featured: false,
		date: "2024-06-26",
		live: "https://fmcbenin.com",
		stack: ["Symfony", "Twig", "Stimulus", "Bootstrap"],
		cover: "cover.webp",
	},
	{
		key: "csplus",
		type: "website",
		featured: false,
		date: "2024-08-20",
		live: "https://csplusbj.com",
		stack: ["Symfony", "Twig", "MySQL", "Bootstrap"],
		cover: "cover.webp",
	},
];
