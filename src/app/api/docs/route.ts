import { SITE_URL } from "@/data/constants";

export function GET() {
	const docs = `# Markdown for Agents API

Machine-readable markdown version of every content page on ${SITE_URL}, for AI agents and automated crawlers.

## Two ways to use it

### 1. Content negotiation (recommended)

Send any human-facing URL with \`Accept: text/markdown\`:

\`\`\`bash
curl -H "Accept: text/markdown" ${SITE_URL}/en/blog/self-taught-journey
\`\`\`

Your tooling keeps the same URL a human would visit. Browsers without the header receive HTML.

### 2. Direct API endpoints

Call the markdown route explicitly:

- \`GET ${SITE_URL}/api/md/{locale}\` — home page
- \`GET ${SITE_URL}/api/md/{locale}/blog\` — blog post list
- \`GET ${SITE_URL}/api/md/{locale}/blog/{slug}\` — one blog post
- \`GET ${SITE_URL}/api/md/{locale}/projects\` — projects list

\`{locale}\` must be \`en\` or \`fr\`.

## Response format

- \`Content-Type: text/markdown; charset=utf-8\`
- \`x-markdown-tokens\`: estimated token count (≈4 characters per token)
- \`Vary: Accept\` on negotiated endpoints
- \`Cache-Control: public, s-maxage=3600, must-revalidate\`

Blog posts include a metadata header (title, author, publish date, updated date, reading time, tags, canonical URL) before the content body.

## Discovery

| Resource | URL |
|---|---|
| API catalog (RFC 9727) | ${SITE_URL}/.well-known/api-catalog |
| OpenAPI 3.1 spec | ${SITE_URL}/api/openapi.json |
| Health | ${SITE_URL}/api/health |
| Sitemap | ${SITE_URL}/sitemap.xml |
| Robots | ${SITE_URL}/robots.txt |
| RSS (EN) | ${SITE_URL}/feed.xml |
| RSS (FR) | ${SITE_URL}/feed-fr.xml |

## Content usage signals

This site publishes Content-Signal directives authorizing \`ai-train\`, \`search\`, and \`ai-input\`. See \`${SITE_URL}/robots.txt\`.

## Contact

Rostand MIGAN — ${SITE_URL}
`;

	return new Response(docs, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate",
		},
	});
}
