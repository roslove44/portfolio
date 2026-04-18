import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);

function wantsMarkdown(request: NextRequest): boolean {
	const accept = request.headers.get("accept") ?? "";
	return accept.toLowerCase().includes("text/markdown");
}

export function proxy(request: NextRequest) {
	if (wantsMarkdown(request)) {
		const { pathname, search } = request.nextUrl;
		const hasLocale = LOCALE_PREFIX.test(pathname);
		const normalized = hasLocale
			? pathname
			: `/${routing.defaultLocale}${pathname === "/" ? "" : pathname}`;
		const url = request.nextUrl.clone();
		url.pathname = `/api/md${normalized}`;
		url.search = search;
		return NextResponse.rewrite(url);
	}

	return intlMiddleware(request);
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|resume|[a-z]{2}/(?:opengraph-image|twitter-image|apple-icon|icon)|.*\\..*).*)"],
};
