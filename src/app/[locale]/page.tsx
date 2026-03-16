import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Stack from "@/components/sections/stack";
import Activity from "@/components/sections/activity";
import Projects from "@/components/sections/projects";
import Resume from "@/components/sections/resume";
import Blog from "@/components/sections/blog";
import { SITE_URL } from "@/data/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const url = `${SITE_URL}/${locale}`;
	return {
		alternates: {
			canonical: url,
			languages: {
				en: `${SITE_URL}/en`,
				fr: `${SITE_URL}/fr`,
				"x-default": `${SITE_URL}/en`,
			},
		},
	};
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Hero />
			<Stack />
			<Activity />
			<Projects />
			<Blog />
			<Resume />
		</>
	);
}
