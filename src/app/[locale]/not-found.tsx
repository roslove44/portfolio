import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, FolderOpen, BookOpen } from "lucide-react";

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default async function NotFound() {
	const t = await getTranslations("notFound");

	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20 text-center">
			<Image src="/404.svg" alt={t("title")} width={320} height={280} className="w-full max-w-xs h-auto" loading="eager" unoptimized />
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-text-primary">{t("title")}</h1>
				<p className="mt-2 text-sm text-text-secondary">{t("description")}</p>
			</div>
			<div className="flex flex-col items-center gap-2 text-sm">
				<Link href="/" className="inline-flex items-center gap-1.5 text-accent hover:underline">
					<ArrowLeft size={14} />{t("backHome")}
				</Link>
				<Link href="/projects" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent hover:underline">
					<FolderOpen size={14} />{t("projects")}
				</Link>
				<Link href="/blog" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent hover:underline">
					<BookOpen size={14} />{t("blog")}
				</Link>
			</div>
		</div>
	);
}
