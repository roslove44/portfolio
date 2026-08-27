import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBlogPost, getAllSlugs } from "@/lib/blog";
import { resolveCover } from "@/lib/blog-cover";
import { getReadingTime, getWordCount } from "@/utils/reading-time";
import { mdxComponents } from "@/components/blog/mdx-components";
import ReadingProgress from "@/components/blog/reading-progress";
import BlogCover from "@/components/blog/blog-cover";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/data/constants";
import { buildMetadataAlternates, localeUrl, buildBreadcrumbLd } from "@/lib/metadata";
import { UserAvatar } from "@/components/ui/user-avatar";

export function generateStaticParams() {
	return routing.locales.flatMap((locale) =>
		getAllSlugs(locale).map((slug) => ({ locale, slug }))
	);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
	const { locale, slug } = await params;
	const post = getBlogPost(locale, slug);
	if (!post) return {};

	const url = localeUrl(locale, `/blog/${slug}`);
	const cover = resolveCover(locale, post);
	const images = [{
		url: cover.url,
		...(cover.width && cover.height && { width: cover.width, height: cover.height }),
		alt: post.title,
	}];

	return {
		title: post.title,
		description: post.description,
		authors: [{ name: "Rostand MIGAN", url: SITE_URL }],
		robots: { index: true, follow: true },
		alternates: buildMetadataAlternates(locale, `/blog/${slug}`),
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

	const t = await getTranslations({ locale, namespace: "blog" });
	const th = await getTranslations({ locale, namespace: "header" });
	const readingTime = getReadingTime(post.content);
	const wordCount = getWordCount(post.content);
	const url = localeUrl(locale, `/blog/${slug}`);

	const breadcrumbLd = buildBreadcrumbLd(locale, `/blog/${slug}`, [
		{ name: th("home"), path: "" },
		{ name: t("pageTitle"), path: "/blog" },
		{ name: post.title },
	]);

	const pageId = `${url}#webpage`;
	const articleId = `${url}#article`;
	const cover = resolveCover(locale, post);
	const coverLd = {
		"@type": "ImageObject",
		"@id": `${url}#cover`,
		url: cover.url,
		contentUrl: cover.url,
		...(cover.width && cover.height && { width: cover.width, height: cover.height }),
		caption: post.title,
	};

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": pageId,
				url,
				name: post.title,
				description: post.description,
				inLanguage: locale === "fr" ? "fr" : "en",
				isPartOf: { "@id": `${SITE_URL}/#website` },
				breadcrumb: { "@id": `${url}#breadcrumb` },
				primaryImageOfPage: { "@id": coverLd["@id"] },
				mainEntity: { "@id": articleId },
				datePublished: post.date,
				...(post.updatedAt && { dateModified: post.updatedAt }),
			},
			{
				"@type": "BlogPosting",
				"@id": articleId,
				headline: post.title,
				description: post.description,
				url,
				inLanguage: locale === "fr" ? "fr" : "en",
				mainEntityOfPage: { "@id": pageId },
				datePublished: post.date,
				...(post.updatedAt && { dateModified: post.updatedAt }),
				image: coverLd,
				...(post.tags && { keywords: post.tags }),
				wordCount,
				timeRequired: `PT${readingTime}M`,
				author: { "@id": `${SITE_URL}/#person` },
				publisher: { "@id": `${SITE_URL}/#person` },
				isPartOf: { "@id": `${SITE_URL}/#blog` },
			},
		],
	};

	return (
		<article className="py-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
			/>
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
				<div className="flex items-center gap-6 mt-6">
					<div className="flex items-center gap-3">
						<UserAvatar src="/avatar.webp" firstname="Rostand" lastname="MIGAN" size="xl" />
						<div className="flex flex-col">
							<span className="text-xs text-text-secondary">{t("author")}</span>
							<Link
								href="/"
								className="text-sm font-semibold text-text-primary hover:text-accent underline decoration-transparent hover:decoration-current transition-all duration-200"
							>
								Rostand MIGAN
							</Link>
						</div>
					</div>
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

			{post.cover && <BlogCover src={post.cover} alt={post.title} />}

			<div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none">
				<MDXRemote
					source={post.content}
					components={mdxComponents}
					options={{
						mdxOptions: {
							remarkPlugins: [remarkGfm],
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
