import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata, ResolvingMetadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBlogPost, getAllSlugs } from "@/lib/blog";
import { getReadingTime } from "@/utils/reading-time";
import { mdxComponents } from "@/components/blog/mdx-components";
import ReadingProgress from "@/components/blog/reading-progress";
import { routing } from "@/i18n/routing";
import { SITE_URL, SOCIAL_LINKS } from "@/data/constants";

export function generateStaticParams() {
	return routing.locales.flatMap((locale) =>
		getAllSlugs(locale).map((slug) => ({ locale, slug }))
	);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	const { locale, slug } = await params;
	const post = getBlogPost(locale, slug);
	if (!post) return {};

	const url = `${SITE_URL}/${locale}/blog/${slug}`;
	const coverUrl = post.cover ? (post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}`) : undefined;
	const images = coverUrl ? [{ url: coverUrl, width: 1200, height: 630 }] : (await parent).openGraph?.images || [];

	return {
		title: post.title,
		description: post.description,
		robots: { index: true, follow: true },
		alternates: {
			canonical: url,
			languages: {
				en: `${SITE_URL}/en/blog/${slug}`,
				fr: `${SITE_URL}/fr/blog/${slug}`,
				"x-default": `${SITE_URL}/en/blog/${slug}`,
			},
		},
		openGraph: {
			type: "article",
			title: post.title,
			description: post.description,
			url,
			siteName: "Rostand MIGAN",
			publishedTime: post.date,
			...(post.updatedAt && { modifiedTime: post.updatedAt }),
			...(post.tags && { tags: post.tags }),
			images,
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
			images,
		},
	};
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const post = getBlogPost(locale, slug);
	if (!post) notFound();

	const readingTime = getReadingTime(post.content);
	const url = `${SITE_URL}/${locale}/blog/${slug}`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		url,
		datePublished: post.date,
		...(post.updatedAt && { dateModified: post.updatedAt }),
		...(post.cover && { image: post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}` }),
		author: {
			"@type": "Person",
			name: "Rostand MIGAN",
			url: SITE_URL,
			image: `${SITE_URL}/avatar.webp`,
			sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.x],
		},
	};

	return (
		<article className="py-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<ReadingProgress />
			<Link
				href="/blog"
				className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
			>
				<ArrowLeft size={14} />
				<span>Blog</span>
			</Link>

			<header className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight text-text-primary">
					{post.title}
				</h1>
				<div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-text-secondary">
					<time dateTime={post.date}>
						{new Date(post.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
					</time>
					{post.updatedAt && (
						<>
							<span className="text-text-secondary/80">·</span>
							<span className="italic">
								{locale === "fr" ? "maj." : "updated"}{" "}
								{new Date(post.updatedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
							</span>
						</>
					)}
					<span className="text-text-secondary/80">·</span>
					<span>{readingTime} min {locale === "fr" ? "de lecture" : "read"}</span>
				</div>
				{post.tags && post.tags.length > 0 && (
					<div className="mt-1.5 text-sm flex flex-wrap gap-x-1.5 gap-y-0.5 font-medium" aria-label={`Tags: ${post.tags.join(", ")}`} role="list">
						{post.tags.map((tech) => (
							<span key={tech} className="text-text-secondary" role="listitem" aria-label={tech}>
								<span aria-hidden="true">#</span>{tech}
							</span>
						))}
					</div>
				)}
			</header>

			<div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none">
				<MDXRemote
					source={post.content}
					components={mdxComponents}
					options={{
						mdxOptions: {
							rehypePlugins: [
								[rehypePrettyCode, {
									theme: "github-dark-dimmed",
									keepBackground: false,
								}],
							],
						},
					}}
				/>
			</div>
		</article>
	);
}
