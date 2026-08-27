import { SITE_URL } from "@/data/constants";
import { getPublicImageSize } from "@/lib/image";
import { localeUrl } from "@/lib/metadata";
import type { BlogPost } from "@/types/blog";

export const GENERATED_COVER_SIZE = { width: 1200, height: 630 } as const;

/**
 * URL of the cover generated on the fly for an article without one.
 * No file extension: the proxy matcher skips every path containing a dot,
 * which would leave the default locale without its `[locale]` segment.
 */
export function generatedCoverUrl(locale: string, slug: string): string {
	return `${localeUrl(locale, `/blog/${slug}`)}/cover`;
}

export type ResolvedCover = {
	url: string;
	width?: number;
	height?: number;
	generated: boolean;
};

/** Frontmatter cover when there is one, generated cover otherwise. */
export function resolveCover(locale: string, post: BlogPost): ResolvedCover {
	if (!post.cover) {
		return { url: generatedCoverUrl(locale, post.slug), ...GENERATED_COVER_SIZE, generated: true };
	}

	if (post.cover.startsWith("http")) {
		return { url: post.cover, generated: false };
	}

	const size = getPublicImageSize(post.cover);
	return { url: `${SITE_URL}${post.cover}`, ...(size ?? {}), generated: false };
}
