import type { MDXComponents } from "mdx/types";
import CodeBlock from "./code-block";
import BlogImage from "./blog-image";
import BlogVideo from "./blog-video";
import BlogGallery from "./blog-gallery";
import PromptBlock from "./prompt-block";
import Lead from "./lead";

export const mdxComponents: MDXComponents = {
	pre: (props) => <CodeBlock {...props} />,
	table: (props) => (
		<div className="my-6 overflow-x-auto rounded-lg border border-border">
			<table className="w-full border-collapse text-sm" {...props} 
			style={{marginTop: "0", marginBottom: "0"}}
			/>
		</div>
	),
	thead: (props) => <thead className="bg-surface" {...props} />,
	tbody: (props) => <tbody className="divide-y divide-border" {...props} />,
	tr: (props) => <tr className="divide-x divide-border" {...props} />,
	th: (props) => <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary" {...props} />,
	td: (props) => <td className="px-4 py-3 text-text-primary align-top" {...props} />,
	a: ({ href, ...props }) => {
		const isExternal = href?.startsWith("http") && !href?.includes("rostand.dev");
		return <a href={href} {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })} {...props} />;
	},
	img: (props) => <BlogImage src={props.src ?? ""} alt={props.alt ?? ""} />,
	BlogImage,
	BlogVideo,
	BlogGallery,
	PromptBlock,
	Lead,
};
