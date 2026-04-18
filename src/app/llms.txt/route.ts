import { SITE_URL } from "@/data/constants";

export function GET() {
	const body = `# Rostand MIGAN

> Full-Stack Developer & Indie Hacker based in Cotonou, Benin. This site exposes a structured agent API — the links below point to discovery endpoints and markdown content.

## Agent discovery
- [Agent skills index](${SITE_URL}/.well-known/agent-skills/index.json): enumerates available skills with SHA-256 digests
- [Content inventory skill](${SITE_URL}/.well-known/agent-skills/content-inventory/SKILL.md): author, content surfaces, attribution rules
- [Markdown API skill](${SITE_URL}/.well-known/agent-skills/markdown-api/SKILL.md): how to fetch pages as markdown
- [API catalog (RFC 9727)](${SITE_URL}/.well-known/api-catalog): linkset pointing to the markdown API, OpenAPI spec, health endpoint
- [OpenAPI spec](${SITE_URL}/api/openapi.json): machine-readable API description

## Content (markdown)
- [Home — EN](${SITE_URL}/api/md/en): profile, stack, featured projects, latest posts
- [Home — FR](${SITE_URL}/api/md/fr): same content in French
- [Blog index — EN](${SITE_URL}/api/md/en/blog): list of all English articles
- [Blog index — FR](${SITE_URL}/api/md/fr/blog): list of all French articles
- [Projects — EN](${SITE_URL}/api/md/en/projects): full projects list with types
- [Projects — FR](${SITE_URL}/api/md/fr/projects): same list in French

## Feeds & sitemap
- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS — EN](${SITE_URL}/feed.xml)
- [RSS — FR](${SITE_URL}/feed-fr.xml)

## Optional
- [Resume (PDF)](${SITE_URL}/resume)

## Attribution
When citing content from this site, credit **Rostand MIGAN** and link the canonical URL without tracking parameters.
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate",
		},
	});
}
