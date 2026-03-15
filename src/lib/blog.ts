import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	updatedAt?: string;
	description: string;
	tags: string[];
	cover?: string;
};

export type BlogPostWithContent = BlogPost & {
	content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function parseFrontmatter(file: string, dir: string) {
	const raw = fs.readFileSync(path.join(dir, file), "utf-8");
	return matter(raw);
}

export function getBlogPosts(locale: string): BlogPost[] {
	const dir = path.join(BLOG_DIR, locale);
	if (!fs.existsSync(dir)) return [];

	const posts: BlogPost[] = [];

	for (const file of fs.readdirSync(dir)) {
		if (!file.endsWith(".mdx")) continue;
		const { data } = parseFrontmatter(file, dir);
		if (data.draft) continue;
		posts.push({
			slug: file.replace(/\.mdx$/, ""),
			title: data.title ?? "",
			date: data.date ?? "",
			updatedAt: data.updatedAt,
			description: data.description ?? "",
			tags: data.tags ?? [],
			cover: data.cover,
		});
	}

	return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(locale: string, slug: string): BlogPostWithContent | null {
	const file = path.join(BLOG_DIR, locale, `${slug}.mdx`);
	if (!fs.existsSync(file)) return null;

	const raw = fs.readFileSync(file, "utf-8");
	const { data, content } = matter(raw);

	if (data.draft) return null;

	return {
		slug,
		title: data.title ?? "",
		date: data.date ?? "",
		updatedAt: data.updatedAt,
		description: data.description ?? "",
		tags: data.tags ?? [],
		cover: data.cover,
		content,
	};
}

export function getAllSlugs(locale: string): string[] {
	const dir = path.join(BLOG_DIR, locale);
	if (!fs.existsSync(dir)) return [];

	return fs
		.readdirSync(dir)
		.filter((file) => file.endsWith(".mdx"))
		.filter((file) => {
			const { data } = parseFrontmatter(file, dir);
			return !data.draft;
		})
		.map((file) => file.replace(/\.mdx$/, ""));
}
