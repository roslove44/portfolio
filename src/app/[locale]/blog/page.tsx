import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata, ResolvingMetadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBlogPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/blog-card";
import { Fragment } from "react/jsx-runtime";
import { SITE_URL } from "@/data/constants";

function buildBreadcrumbLd(locale: string) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/${locale}` },
			{ "@type": "ListItem", position: 2, name: "Blog" },
		],
	};
}

function buildBlogLd(locale: string, posts: ReturnType<typeof getBlogPosts>) {
	const url = `${SITE_URL}/${locale}/blog`;
	return {
		"@context": "https://schema.org",
		"@type": "Blog",
		"@id": `${SITE_URL}/#blog`,
		name: "Rostand MIGAN — Blog",
		url,
		inLanguage: locale === "fr" ? "fr" : "en",
		author: { "@id": `${SITE_URL}/#person` },
		publisher: { "@id": `${SITE_URL}/#person` },
		isPartOf: { "@id": `${SITE_URL}/#website` },
		blogPost: posts.map((post) => ({
			"@type": "BlogPosting",
			headline: post.title,
			description: post.description,
			url: `${SITE_URL}/${locale}/blog/${post.slug}`,
			datePublished: post.date,
			...(post.updatedAt && { dateModified: post.updatedAt }),
			author: { "@id": `${SITE_URL}/#person` },
		})),
	};
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "blog" });
	const tm = await getTranslations({ locale, namespace: "metadata" });
	const url = `${SITE_URL}/${locale}/blog`;
	const title = t("pageTitle");
	const description = tm("blogDescription");
	const parentImages = (await parent).openGraph?.images || [];

	return {
		title,
		description,
		robots: { index: true, follow: true },
		alternates: {
			canonical: url,
			languages: {
				en: `${SITE_URL}/en/blog`,
				fr: `${SITE_URL}/fr/blog`,
				"x-default": `${SITE_URL}/en/blog`,
			},
		},
		openGraph: {
			type: "website",
			title,
			description,
			url,
			siteName: "Rostand MIGAN",
			images: parentImages,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: parentImages,
		},
	};
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("blog");
	const posts = getBlogPosts(locale);

	return (
		<section className="py-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbLd(locale)) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBlogLd(locale, posts)) }}
			/>
			<Link
				href="/"
				className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
			>
				<ArrowLeft size={14} />
				<span>{t("backHome")}</span>
			</Link>

			<h1 className="mb-6 text-xl font-semibold tracking-tight text-text-primary">
				{t("title")}
			</h1>

			<h2 className="sr-only">
				{t("list")}
			</h2>

			{posts.length === 0 ? (
				<p className="text-sm text-text-secondary">{t("empty")}</p>
			) : (
				<div className="grid grid-cols-1">
					{posts.map((post, i) => (
						<Fragment key={post.slug}>
							<BlogCard post={post} />
							{i < posts.length - 1 && <hr className="text-border my-6" />}
						</Fragment>
					))}
				</div>
			)}
		</section>
	);
}
