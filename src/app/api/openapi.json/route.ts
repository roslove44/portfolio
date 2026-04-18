import { SITE_URL, SOCIAL_LINKS } from "@/data/constants";

export function GET() {
	const localeParam = {
		name: "locale",
		in: "path" as const,
		required: true,
		schema: { type: "string" as const, enum: ["en", "fr"] },
	};

	const markdownResponse = {
		"200": {
			description: "Markdown representation of the page",
			headers: {
				"x-markdown-tokens": {
					description: "Estimated token count of the response body",
					schema: { type: "integer" },
				},
			},
			content: {
				"text/markdown": {
					schema: { type: "string" },
				},
			},
		},
	};

	const spec = {
		openapi: "3.1.0",
		info: {
			title: "Rostand MIGAN — Markdown for Agents API",
			version: "1.0.0",
			description:
				"Returns markdown representations of site pages for AI agents. The canonical way to consume this API is content negotiation (send Accept: text/markdown to any site URL). These explicit endpoints exist for programmatic discovery.",
			contact: {
				name: "Rostand MIGAN",
				url: SITE_URL,
				email: SOCIAL_LINKS.email,
			},
			license: { name: "Content-Signal: ai-train=yes, search=yes, ai-input=yes" },
		},
		servers: [{ url: SITE_URL, description: "Production" }],
		paths: {
			"/api/md/{locale}": {
				get: {
					summary: "Home page as markdown",
					operationId: "getHome",
					parameters: [localeParam],
					responses: {
						...markdownResponse,
						"404": { description: "Unknown locale" },
					},
				},
			},
			"/api/md/{locale}/blog": {
				get: {
					summary: "Blog post list as markdown",
					operationId: "getBlogList",
					parameters: [localeParam],
					responses: markdownResponse,
				},
			},
			"/api/md/{locale}/blog/{slug}": {
				get: {
					summary: "Single blog post as markdown",
					operationId: "getBlogPost",
					parameters: [
						localeParam,
						{
							name: "slug",
							in: "path" as const,
							required: true,
							schema: { type: "string" as const },
						},
					],
					responses: {
						...markdownResponse,
						"404": { description: "Post not found" },
					},
				},
			},
			"/api/md/{locale}/projects": {
				get: {
					summary: "Projects list as markdown",
					operationId: "getProjects",
					parameters: [localeParam],
					responses: markdownResponse,
				},
			},
			"/api/health": {
				get: {
					summary: "Health check",
					operationId: "health",
					responses: {
						"200": {
							description: "Service is healthy",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["status", "timestamp"],
										properties: {
											status: { type: "string", enum: ["ok"] },
											timestamp: { type: "string", format: "date-time" },
										},
									},
								},
							},
						},
					},
				},
			},
		},
	};

	return new Response(JSON.stringify(spec, null, 2), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate",
		},
	});
}
