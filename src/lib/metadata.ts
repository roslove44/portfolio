import { SITE_URL } from "@/data/constants";
import { routing } from "@/i18n/routing";

const defaultLocale = routing.defaultLocale;

function normalizePath(path: string): string {
	if (!path || path === "/") return "";
	return path.startsWith("/") ? path : `/${path}`;
}

export function localeUrl(locale: string, path = ""): string {
	const normalizedPath = normalizePath(path);

	if (locale === defaultLocale) {
		return `${SITE_URL}${normalizedPath || "/"}`;
	}

	return `${SITE_URL}/${locale}${normalizedPath}`;
}

export function buildLanguageAlternates(path = ""): Record<string, string> {
	const languages: Record<string, string> = {
		"x-default": localeUrl(defaultLocale, path),
	};

	for (const locale of routing.locales) {
		languages[locale] = localeUrl(locale, path);
	}

	return languages;
}

export function buildMetadataAlternates(locale: string, path = "") {
	return {
		canonical: localeUrl(locale, path),
		languages: buildLanguageAlternates(path),
	};
}
