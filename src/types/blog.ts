export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	updatedAt?: string;
	description: string;
	tags: string[];
	cover?: string;
};

export type BlogPostWithContent = BlogPost & {
	content: string;
};
