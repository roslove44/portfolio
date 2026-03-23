import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata, ResolvingMetadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ProjectsList from "@/components/projects/projects-list";
import { SITE_URL } from "@/data/constants";

function buildBreadcrumbLd(locale: string) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/${locale}` },
			{ "@type": "ListItem", position: 2, name: "Projects" },
		],
	};
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "projects" });
	const tm = await getTranslations({ locale, namespace: "metadata" });
	const url = `${SITE_URL}/${locale}/projects`;
	const title = t("pageTitle");
	const description = tm("projectsDescription");
	const parentImages = (await parent).openGraph?.images || [];

	return {
		title,
		description,
		robots: { index: true, follow: true },
		alternates: {
			canonical: url,
			languages: {
				en: `${SITE_URL}/en/projects`,
				fr: `${SITE_URL}/fr/projects`,
				"x-default": `${SITE_URL}/en/projects`,
			},
		},
		openGraph: {
			type: "website",
			title,
			description,
			url,
			siteName: "Rostand MIGAN",
			images: parentImages,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: parentImages,
		},
	};
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("projects");

	return (
		<section className="py-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbLd(locale)) }}
			/>
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
