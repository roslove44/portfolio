import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBlogPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/blog-card";

export default async function Blog() {
	const locale = await getLocale();
	const t = await getTranslations("blog");
	const posts = getBlogPosts(locale).slice(0, 2);

	if (posts.length === 0) return null;

	return (
		<section className="py-3">
			<h2 className="mb-4 font-semibold tracking-wide text-text-primary">
				{t("title")}
			</h2>

			<div className="grid grid-cols-1 gap-x-6 gap-y-2">
				{posts.map((post) => (
					<BlogCard key={post.slug} post={post} />
				))}
			</div>

			<div className="mt-2 flex items-center gap-2 justify-end text-[13px]">
				<Link
					href="/blog"
					className="font-medium text-secondary underline decoration-text-secondary/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
				>
					{t("cta")}
					<ArrowRight size={16} className="ms-1 inline-block text-secondary" />
				</Link>
			</div>
		</section>
	);
}
