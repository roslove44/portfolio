import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Stack from "@/components/sections/stack";
import Activity from "@/components/sections/activity";
import Projects from "@/components/sections/projects";
import Resume from "@/components/sections/resume";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Hero />
			<About />
			<Stack />
			<Activity />
			<Projects />
			<Resume />
		</>
	);
}
