import type { MDXComponents } from "mdx/types";
import CodeBlock from "./code-block";
import BlogImage from "./blog-image";
import BlogVideo from "./blog-video";
import BlogGallery from "./blog-gallery";

export const mdxComponents: MDXComponents = {
	pre: (props) => <CodeBlock {...props} />,
	a: ({ href, ...props }) => {
		const isExternal = href?.startsWith("http") && !href?.includes("rostand.dev");
		return <a href={href} {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })} {...props} />;
	},
	img: (props) => <BlogImage src={props.src ?? ""} alt={props.alt ?? ""} />,
	BlogImage,
	BlogVideo,
	BlogGallery,
};
