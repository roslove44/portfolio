import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import {
	buildHomeMarkdown,
	buildBlogListMarkdown,
	buildBlogPostMarkdown,
	buildProjectsMarkdown,
	estimateTokens,
} from "@/lib/markdown";

type Locale = (typeof routing.locales)[number];

function isLocale(value: string): value is Locale {
	return (routing.locales as readonly string[]).includes(value);
}

function markdownResponse(body: string, status = 200) {
	return new NextResponse(body, {
		status,
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"x-markdown-tokens": String(estimateTokens(body)),
			"Vary": "Accept",
			"Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
		},
	});
}

function notFoundMarkdown() {
	return markdownResponse("# Not found\n\nThis page does not exist.\n", 404);
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
	const { path } = await params;
	const [locale, ...rest] = path;

	if (!locale || !isLocale(locale)) return notFoundMarkdown();

	if (rest.length === 0) {
		return markdownResponse(await buildHomeMarkdown(locale));
	}

	const [section, ...tail] = rest;

	if (section === "blog") {
		if (tail.length === 0) return markdownResponse(await buildBlogListMarkdown(locale));
		if (tail.length === 1) {
			const body = await buildBlogPostMarkdown(locale, tail[0]);
			return body ? markdownResponse(body) : notFoundMarkdown();
		}
	}

	if (section === "projects" && tail.length === 0) {
		return markdownResponse(await buildProjectsMarkdown(locale));
	}

	return notFoundMarkdown();
}
