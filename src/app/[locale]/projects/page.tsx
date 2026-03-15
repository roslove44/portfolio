import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ProjectsList from "@/components/projects/projects-list";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "projects" });
	return { title: t("pageTitle") };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("projects");

	return (
		<section className="py-8">
			<Link
				href="/"
				className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
			>
				<ArrowLeft size={14} />
				<span>{t("backHome")}</span>
			</Link>

			<ProjectsList />
		</section>
	);
}
