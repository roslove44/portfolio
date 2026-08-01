export type ProjectType = "saas" | "app" | "tool" | "website";

export const PROJECT_TYPES: ProjectType[] = ["saas", "app", "tool", "website"];

export type ProjectStatus = "in-progress" | "completed";

export type Project = {
	key: string;
	type: ProjectType;
	status?: ProjectStatus;
	featured: boolean;
	date: string;
	stack: string[];
	github?: string;
	live?: string;
	blog?: string; // slug of the related article in content/blog/<locale>/
	video?: string;
	images?: string[];
	cover?: string;
	owner?: { name: string; url: string; social: "github" | "x" | "linkedin" };
};
