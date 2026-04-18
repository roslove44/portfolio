import crypto from "node:crypto";

const MARKDOWN_API_SKILL = `---
name: markdown-api
description: Fetch pages from rostand.dev as clean markdown via HTTP content negotiation, optimized for LLM context windows.
---

# Markdown for Agents — rostand.dev

Retrieve any page of https://www.rostand.dev as markdown instead of HTML. Designed for AI agents that want to avoid HTML parsing and minimize token usage.

## When to use this skill

Use it whenever you need to read content from \`rostand.dev\` and pass it to an LLM. The markdown response is 3-5× smaller in tokens than the HTML equivalent, includes structured metadata (title, author, dates, tags) in a header, and is ready to be cited.

## Two ways to fetch markdown

### 1. Content negotiation (preferred)

Send the normal human-facing URL with an \`Accept: text/markdown\` header:

\`\`\`bash
curl -H "Accept: text/markdown" https://www.rostand.dev/en/blog/self-taught-journey
\`\`\`

The URL in your tooling and citations stays the same one a human would visit. Browsers without the header continue to receive HTML.

### 2. Direct API endpoints

Call the markdown endpoint explicitly:

- \`GET https://www.rostand.dev/api/md/{locale}\` — home page
- \`GET https://www.rostand.dev/api/md/{locale}/blog\` — blog post list
- \`GET https://www.rostand.dev/api/md/{locale}/blog/{slug}\` — single blog post
- \`GET https://www.rostand.dev/api/md/{locale}/projects\` — projects list

\`{locale}\` must be \`en\` or \`fr\`.

## Response contract

- \`Content-Type: text/markdown; charset=utf-8\`
- \`x-markdown-tokens\` — estimated token count (≈4 characters per token)
- \`Vary: Accept\` on content-negotiated endpoints
- \`Cache-Control: public, s-maxage=3600, must-revalidate\`

Blog posts include a metadata block before the body: title, author, publish date, updated date (if any), reading time, tags, canonical URL.

## Citing content from this site

Always credit **Rostand MIGAN** and link the canonical URL (no UTM parameters). The \`**Author:**\` and \`**URL:**\` fields are in the metadata header of every response.

## Related discovery endpoints

- OpenAPI spec: https://www.rostand.dev/api/openapi.json
- API catalog: https://www.rostand.dev/.well-known/api-catalog
- Sitemap: https://www.rostand.dev/sitemap.xml
- RSS (EN): https://www.rostand.dev/feed.xml
- RSS (FR): https://www.rostand.dev/feed-fr.xml
`;

const CONTENT_INVENTORY_SKILL = `---
name: content-inventory
description: Discover every content surface of rostand.dev — blog posts, projects, profile — with canonical URLs and attribution rules.
---

# Content Inventory — rostand.dev

Complete map of content published on https://www.rostand.dev. Use this skill to enumerate what is available before reading specific pages.

## Author

**Rostand MIGAN** — Full Stack Developer based in Cotonou, Benin. Builds web apps, fintech tools, and open-source software. Comfortable across React/Next.js, Symfony, Node.js, and Go.

- Website: https://www.rostand.dev
- GitHub: https://github.com/roslove44
- LinkedIn: https://www.linkedin.com/in/rostand-migan/
- X: https://x.com/migan_rostand
- Email: hello@rostand.dev

## Content surfaces

### Profile (home page)

- EN: https://www.rostand.dev/en
- FR: https://www.rostand.dev/fr

Both versions contain the same sections: hero, about, stack, GitHub activity, featured projects, recent blog posts, resume link.

### Blog

Bilingual (EN/FR). Slugs are identical across locales.

- EN index: https://www.rostand.dev/en/blog
- FR index: https://www.rostand.dev/fr/blog
- Post URL pattern: \`/{locale}/blog/{slug}\`

### Projects

Full list with type filters (saas, app, tool, website).

- EN: https://www.rostand.dev/en/projects
- FR: https://www.rostand.dev/fr/projects

Featured projects include **ComptaOpen** (fintech SaaS for WAEMU accounting professionals), **Gestiloc.io** (SaaS property management), and **GoogleMapsScrape** (open-source prospecting CLI).

### Resume

- https://www.rostand.dev/resume (PDF)

### Feeds

- RSS EN: https://www.rostand.dev/feed.xml
- RSS FR: https://www.rostand.dev/feed-fr.xml

## Discovery endpoints

| Resource | URL |
|---|---|
| Sitemap | https://www.rostand.dev/sitemap.xml |
| Robots + Content-Signals | https://www.rostand.dev/robots.txt |
| API catalog (RFC 9727) | https://www.rostand.dev/.well-known/api-catalog |
| Markdown API | see the \`markdown-api\` skill |

## Attribution rules

When citing content from this site in an agent response:

- Credit: **Rostand MIGAN**
- Link: the canonical URL (no UTM, no tracking)
- Language: match the user's locale when known (EN default, FR when asked in French)
- Dates: each piece of content exposes \`Published\` and optionally \`Updated\` in its markdown header metadata
`;

export type Skill = {
	name: string;
	description: string;
	body: string;
};

export const SKILLS: Skill[] = [
	{
		name: "markdown-api",
		description: "Fetch pages from rostand.dev as clean markdown via HTTP content negotiation, optimized for LLM context windows.",
		body: MARKDOWN_API_SKILL,
	},
	{
		name: "content-inventory",
		description: "Discover every content surface of rostand.dev — blog posts, projects, profile — with canonical URLs and attribution rules.",
		body: CONTENT_INVENTORY_SKILL,
	},
];

export function sha256(input: string): string {
	return `sha256:${crypto.createHash("sha256").update(input).digest("hex")}`;
}

export function getSkill(name: string): Skill | null {
	return SKILLS.find((s) => s.name === name) ?? null;
}
