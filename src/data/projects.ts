export type Project = {
	key: string;
	featured: boolean;
	date: string;
	stack: string[];
	github?: string;
	live?: string;
	video?: string;
	images?: string[];
	cover?: string;
	owner?: { name: string; url: string; social: "github" | "x" | "linkedin" };
};

export const PROJECTS: Project[] = [
	{
		key: "comptaopen",
		featured: true,
		date: "2026-01-01",
		stack: ["Next.js", "TypeScript", "AdonisJS", "PostgreSQL", "Docker", "Gotenberg"],
		cover: "cover.webp",
		video: "https://youtu.be/ufcDIOS1HRo?list=RDufcDIOS1HRo",
	},
	{
		key: "gestiloc",
		featured: true,
		date: "2026-01-26",
		live: "https://gestiloc.io",
		stack: ["Next.js", "Supabase", "TypeScript", "TipTap", "Shadcn/ui"],
		cover: "cover.webp",
		owner: { name: "Marius DJENONTIN", url: "https://github.com/mariusdjen", social: "github" }
	},
	{
		key: "gmaps-scraper",
		featured: false,
		date: "2025-01-13",
		stack: ["Python"],
		github: "https://github.com/roslove44/GoogleMapsScrape",
	},
];
