import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/constants";
import { getBlogPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";
import { buildLanguageAlternates, localeUrl, AVATAR_URL } from "@/lib/metadata";

const locales = routing.locales;

function buildAlternates(path: string) {
	return { languages: buildLanguageAlternates(path) };
}

type StaticRoute = {
	url: string;
	changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
	priority: number;
	images?: string[];
};

const STATIC_ROUTES: StaticRoute[] = [
	{ url: "", changeFrequency: "monthly", priority: 1.0, images: [AVATAR_URL] },
	{ url: "/blog", changeFrequency: "weekly", priority: 0.8 },
	{ url: "/projects", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(({ url, changeFrequency, priority, images }) =>
		locales.map((locale) => ({
			url: localeUrl(locale, url),
			lastModified: now,
			changeFrequency,
			priority,
			alternates: buildAlternates(url),
			...(images && { images }),
		}))
	);

	const blogRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => {
		const posts = getBlogPosts(locale);
		return posts.map((post) => ({
			url: localeUrl(locale, `/blog/${post.slug}`),
			lastModified: new Date(post.updatedAt ?? post.date),
			changeFrequency: "monthly" as const,
			priority: 0.7,
			alternates: buildAlternates(`/blog/${post.slug}`),
		}));
	});

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
