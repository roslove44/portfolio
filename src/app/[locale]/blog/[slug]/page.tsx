import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBlogPost, getAllSlugs } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
	return routing.locales.flatMap((locale) =>
		getAllSlugs(locale).map((slug) => ({ locale, slug }))
	);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params;
	const post = getBlogPost(locale, slug);
	if (!post) return {};
	return {
		title: post.title,
		description: post.description,
		...(post.cover && { openGraph: { images: [post.cover] } }),
		...(post.updatedAt && { other: { "article:modified_time": post.updatedAt } }),
	};
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const post = getBlogPost(locale, slug);
	if (!post) notFound();

	return (
		<article className="py-8">
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
					{post.tags.length > 0 && (
						<>
							<span className="text-text-secondary/80">·</span>
							<span>{post.tags.join(", ")}</span>
						</>
					)}
				</div>
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
