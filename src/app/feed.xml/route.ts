import { getBlogPosts } from "@/lib/blog";
import { SITE_URL } from "@/data/constants";

function escapeXml(str: string): string {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function GET() {
	const posts = getBlogPosts("en");

	const items = posts
		.map((post) => `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${SITE_URL}/en/blog/${post.slug}</link>
			<guid isPermaLink="true">${SITE_URL}/en/blog/${post.slug}</guid>
			<description>${escapeXml(post.description)}</description>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n\t\t\t")}
		</item>`)
		.join("");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rostand MIGAN — Blog</title>
		<link>${SITE_URL}</link>
		<description>Full stack developer. I build, I ship, I solve real problems.</description>
		<language>en</language>
		<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
		${items}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "s-maxage=3600, stale-while-revalidate",
		},
	});
}
