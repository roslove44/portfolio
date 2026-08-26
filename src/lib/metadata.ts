import { SITE_URL, AVATAR } from "@/data/constants";
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

export type BreadcrumbCrumb = {
	name: string;
	path?: string;
};

export function buildBreadcrumbLd(locale: string, path: string, crumbs: BreadcrumbCrumb[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		"@id": `${localeUrl(locale, path)}#breadcrumb`,
		itemListElement: crumbs.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.name,
			...(crumb.path !== undefined && { item: localeUrl(locale, crumb.path) }),
		})),
	};
}

export const AVATAR_ID = `${SITE_URL}/#avatar`;
export const AVATAR_URL = `${SITE_URL}${AVATAR.path}`;

export function buildAvatarImageObject() {
	return {
		"@type": "ImageObject",
		"@id": AVATAR_ID,
		url: AVATAR_URL,
		contentUrl: AVATAR_URL,
		width: AVATAR.width,
		height: AVATAR.height,
		caption: AVATAR.caption,
	};
}
