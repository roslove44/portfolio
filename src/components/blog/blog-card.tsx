import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";

interface Props {
	post: BlogPost;
}

export default function BlogCard({ post }: Props) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className="group relative rounded-sm border border-transparent px-2 py-1.5 text-left transition-all duration-200 hover:border-border/60 hover:bg-surface/60 hover:shadow-xs hover:backdrop-blur-md dark:hover:border-border/40 dark:hover:bg-surface/40"
		>
			<div className="flex items-start justify-between gap-2">
				<h3 className="text-sm font-medium text-text-primary line-clamp-2">
					{post.title}
				</h3>
				<time className="shrink-0 text-xs text-text-secondary" dateTime={post.date}>
					{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
				</time>
			</div>
			<p className="mt-0.5 text-[13px] text-text-secondary line-clamp-2">
				{post.description}
			</p>
			{post.tags.length > 0 && (
				<div className="mt-1.5 flex flex-wrap gap-1">
					{post.tags.map((tag) => (
						<span key={tag} className="text-[11px] text-text-secondary/70">
							{tag}
						</span>
					))}
				</div>
			)}
		</Link>
	);
}
