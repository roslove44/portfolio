export type ProjectType = "saas" | "app" | "tool" | "website";

export const PROJECT_TYPES: ProjectType[] = ["saas", "app", "tool", "website"];

export type Project = {
	key: string;
	type: ProjectType;
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
