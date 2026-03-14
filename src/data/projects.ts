export type Project = {
	key: string;
	featured: boolean;
	date: string;
	stack: string[];
	github?: string;
	live?: string;
	video?: string;
	images?: string[];
};

export const PROJECTS: Project[] = [
	{
		key: "comptaopen",
		featured: true,
		date: "2024-06",
		stack: ["Next.js", "TypeScript", "AdonisJS", "PostgreSQL", "Docker", "Gotenberg"],
		live: "https://comptaopen.com",
	},
	{
		key: "gestiloc",
		featured: true,
		date: "2023-09",
		stack: ["Next.js", "Shadcn UI", "Supabase", "Tailwind CSS"],
	},
	{
		key: "gmaps-scraper",
		featured: false,
		date: "2024-01",
		stack: ["Python"],
		github: "https://github.com/roslove44/GoogleMapsScraper",
	},
];
