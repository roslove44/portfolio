import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/constants";
import { getBlogPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";

const locales = routing.locales;

type AlternateLanguages = Record<string, string>;

function buildAlternates(path: string): { languages: AlternateLanguages } {
	const languages: AlternateLanguages = {
		"x-default": `${SITE_URL}/en${path}`,
	};
	for (const locale of locales) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: "", changeFrequency: "monthly" as const, priority: 1.0 },
		{ url: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
		{ url: "/projects", changeFrequency: "monthly" as const, priority: 0.8 },
	].flatMap(({ url, changeFrequency, priority }) =>
		locales.map((locale) => ({
			url: `${SITE_URL}/${locale}${url}`,
			lastModified: now,
			changeFrequency,
			priority,
			alternates: buildAlternates(url),
		}))
	);

	const blogRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => {
		const posts = getBlogPosts(locale);
		return posts.map((post) => ({
			url: `${SITE_URL}/${locale}/blog/${post.slug}`,
			lastModified: new Date(post.updatedAt ?? post.date),
			changeFrequency: "monthly" as const,
			priority: 0.7,
			alternates: buildAlternates(`/blog/${post.slug}`),
		}));
	});

	// Deduplicate blog routes by URL (both locales may share same slug)
	const seen = new Set<string>();
	const uniqueBlogRoutes = blogRoutes.filter((r) => {
		if (seen.has(r.url)) return false;
		seen.add(r.url);
		return true;
	});

	const resumeRoute: MetadataRoute.Sitemap = [
		{ url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.6 },
	];

	return [...staticRoutes, ...resumeRoute, ...uniqueBlogRoutes];
}
