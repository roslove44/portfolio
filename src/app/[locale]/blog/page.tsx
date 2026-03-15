import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBlogPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/blog-card";
import { Fragment } from "react/jsx-runtime";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "blog" });
	return { title: t("pageTitle") };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("blog");
	const posts = getBlogPosts(locale);

	return (
		<section className="py-8">
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
