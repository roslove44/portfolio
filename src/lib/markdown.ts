import { getTranslations } from "next-intl/server";
import { PROJECTS, HIGHLIGHTED_PROJECTS } from "@/data/projects";
import { SITE_URL, SOCIAL_LINKS, STACK_CATEGORIES } from "@/data/constants";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { getReadingTime } from "@/utils/reading-time";

export function estimateTokens(content: string): number {
	return Math.ceil(content.length / 4);
}

function formatDate(date: string, locale: string): string {
	if (!date) return "";
	return new Date(date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
		year: "numeric", month: "long", day: "numeric",
	});
}

async function renderProject(
	project: typeof PROJECTS[number],
	t: Awaited<ReturnType<typeof getTranslations>>,
	locale: string,
) {
	const name = t(`${project.key}.name` as never);
	const summary = t(`${project.key}.summary` as never);
	const role = safeT(t, `${project.key}.role`);
	const typeLabel = safeT(t, `${project.key}.type`);
	const desc: string[] = safeTArray(t, `${project.key}.desc`);

	const lines: string[] = [];
	lines.push(`### ${name}`);
	lines.push("");
	lines.push(`_${summary}_`);
	lines.push("");

	const meta: string[] = [];
	if (role) meta.push(`**Role:** ${role}`);
	if (typeLabel) meta.push(`**Type:** ${typeLabel}`);
	if (project.date) meta.push(`**Date:** ${formatDate(project.date, locale)}`);
	if (project.status) meta.push(`**Status:** ${project.status}`);
	if (project.stack.length) meta.push(`**Stack:** ${project.stack.join(", ")}`);
	if (project.live) meta.push(`**Live:** ${project.live}`);
	if (project.github) meta.push(`**GitHub:** ${project.github}`);
	if (project.owner) meta.push(`**Owner:** ${project.owner.name} (${project.owner.url})`);
	if (meta.length) {
		lines.push(meta.join("  \n"));
		lines.push("");
	}

	if (desc.length) {
		for (const item of desc) lines.push(`- ${item}`);
		lines.push("");
	}

	return lines.join("\n");
}

function safeT(t: Awaited<ReturnType<typeof getTranslations>>, key: string): string {
	if (!t.has(key as never)) return "";
	const v = t(key as never);
	return typeof v === "string" ? v : "";
}

function safeTArray(t: Awaited<ReturnType<typeof getTranslations>>, key: string): string[] {
	if (!t.has(key as never)) return [];
	const raw = t.raw(key as never) as unknown;
	return Array.isArray(raw) ? raw.map(String) : [];
}

export async function buildHomeMarkdown(locale: string): Promise<string> {
	const t = await getTranslations({ locale });
	const url = `${SITE_URL}/${locale}`;
	const lines: string[] = [];

	lines.push(`# Rostand MIGAN — ${t("metadata.title").split("|")[1]?.trim() ?? "Full Stack Developer"}`);
	lines.push("");
	lines.push(`> ${t("metadata.description")}`);
	lines.push("");
	lines.push(`**URL:** ${url}`);
	lines.push(`**Location:** Cotonou, Benin`);
	lines.push(`**Languages:** English, French`);
	lines.push(`**Contact:** ${SOCIAL_LINKS.email}`);
	lines.push(`**GitHub:** ${SOCIAL_LINKS.github}`);
	lines.push(`**LinkedIn:** ${SOCIAL_LINKS.linkedin}`);
	lines.push(`**X:** ${SOCIAL_LINKS.x}`);
	lines.push("");
	lines.push("---");
	lines.push("");

	lines.push(`## ${t("hero.greeting")}`);
	lines.push("");
	lines.push(`- ${t("hero.bullet1")}`);
	lines.push(`- ${t("hero.bullet2_prefix")}Symfony, Next.js ${t("hero.and")} Go${t("hero.bullet2_suffix")}`);
	lines.push(`- ${t("hero.bullet3_prefix")}ComptaOpen${t("hero.bullet3_suffix")}`);
	lines.push("");
	lines.push(`${t("hero.cta")} — ${t("hero.ctaLink")} : https://cal.com/rostand-dev/let-s-build-something`);
	lines.push("");

	lines.push(`## ${t("about.title")}`);
	lines.push("");
	lines.push(`> ${t("about.hook")}`);
	lines.push("");
	lines.push(t("about.p1"));
	lines.push("");
	lines.push(t("about.p2"));
	lines.push("");
	lines.push(t("about.p3"));
	lines.push("");
	lines.push(t("about.closing"));
	lines.push("");

	lines.push(`## ${t("stack.title")}`);
	lines.push("");
	lines.push(`_${t("stack.statement")}_`);
	lines.push("");
	for (const [category, techs] of Object.entries(STACK_CATEGORIES)) {
		lines.push(`### ${category}`);
		lines.push("");
		for (const tech of techs) {
			const desc = safeT(t, `stack.desc.${tech.key}`);
			lines.push(`- **${tech.name}**${desc ? ` — ${desc}` : ""}`);
		}
		lines.push("");
	}

	lines.push(`## ${t("activity.title")}`);
	lines.push("");
	lines.push(`GitHub contributions calendar for [roslove44](${SOCIAL_LINKS.github}). Live data available on the website.`);
	lines.push("");

	lines.push(`## ${t("projects.title")} (featured)`);
	lines.push("");
	const tProjects = await getTranslations({ locale, namespace: "projects" });
	for (const project of HIGHLIGHTED_PROJECTS) {
		lines.push(await renderProject(project, tProjects, locale));
	}
	lines.push(`See all projects: ${url}/projects`);
	lines.push("");

	lines.push(`## ${t("blog.title")}`);
	lines.push("");
	const posts = getBlogPosts(locale).slice(0, 5);
	if (posts.length === 0) {
		lines.push(t("blog.empty"));
	} else {
		for (const post of posts) {
			lines.push(`- **[${post.title}](${url}/blog/${post.slug})** — ${formatDate(post.date, locale)}`);
			if (post.description) lines.push(`  ${post.description}`);
		}
	}
	lines.push("");
	lines.push(`See all posts: ${url}/blog`);
	lines.push("");

	lines.push(`## ${t("resume.title")}`);
	lines.push("");
	lines.push(`Download: ${SITE_URL}/resume`);
	lines.push("");

	return lines.join("\n");
}

export async function buildProjectsMarkdown(locale: string): Promise<string> {
	const t = await getTranslations({ locale, namespace: "projects" });
	const tMeta = await getTranslations({ locale, namespace: "metadata" });
	const url = `${SITE_URL}/${locale}/projects`;

	const lines: string[] = [];
	lines.push(`# ${t("pageTitle")} — Rostand MIGAN`);
	lines.push("");
	lines.push(`> ${tMeta("projectsDescription")}`);
	lines.push("");
	lines.push(`**URL:** ${url}`);
	lines.push(`**Total projects:** ${PROJECTS.length}`);
	lines.push("");
	lines.push("---");
	lines.push("");

	for (const project of PROJECTS) {
		lines.push(await renderProject(project, t, locale));
	}

	lines.push(`_${t("websiteDisclaimer")}_`);
	lines.push("");

	return lines.join("\n");
}

export async function buildBlogListMarkdown(locale: string): Promise<string> {
	const t = await getTranslations({ locale, namespace: "blog" });
	const tMeta = await getTranslations({ locale, namespace: "metadata" });
	const url = `${SITE_URL}/${locale}/blog`;
	const posts = getBlogPosts(locale);

	const lines: string[] = [];
	lines.push(`# ${t("pageTitle")} — Rostand MIGAN`);
	lines.push("");
	lines.push(`> ${tMeta("blogDescription")}`);
	lines.push("");
	lines.push(`**URL:** ${url}`);
	lines.push(`**Author:** Rostand MIGAN`);
	lines.push(`**Total posts:** ${posts.length}`);
	lines.push("");
	lines.push("---");
	lines.push("");

	if (posts.length === 0) {
		lines.push(t("empty"));
	} else {
		for (const post of posts) {
			lines.push(`## [${post.title}](${SITE_URL}/${locale}/blog/${post.slug})`);
			lines.push("");
			lines.push(`**Published:** ${formatDate(post.date, locale)}  `);
			if (post.updatedAt) lines.push(`**Updated:** ${formatDate(post.updatedAt, locale)}  `);
			if (post.tags?.length) lines.push(`**Tags:** ${post.tags.map((tag) => `#${tag}`).join(", ")}`);
			lines.push("");
			if (post.description) {
				lines.push(post.description);
				lines.push("");
			}
		}
	}

	return lines.join("\n");
}

export async function buildBlogPostMarkdown(locale: string, slug: string): Promise<string | null> {
	const post = getBlogPost(locale, slug);
	if (!post) return null;

	const url = `${SITE_URL}/${locale}/blog/${slug}`;
	const readingTime = getReadingTime(post.content);
	const readingLabel = locale === "fr" ? "min de lecture" : "min read";

	const lines: string[] = [];
	lines.push(`# ${post.title}`);
	lines.push("");
	if (post.description) {
		lines.push(`> ${post.description}`);
		lines.push("");
	}
	lines.push(`**Author:** Rostand MIGAN  `);
	lines.push(`**Published:** ${formatDate(post.date, locale)}  `);
	if (post.updatedAt) lines.push(`**Updated:** ${formatDate(post.updatedAt, locale)}  `);
	lines.push(`**Reading time:** ${readingTime} ${readingLabel}  `);
	if (post.tags?.length) lines.push(`**Tags:** ${post.tags.map((tag) => `#${tag}`).join(", ")}  `);
	lines.push(`**URL:** ${url}`);
	lines.push("");
	lines.push("---");
	lines.push("");
	lines.push(post.content.trim());
	lines.push("");

	return lines.join("\n");
}
