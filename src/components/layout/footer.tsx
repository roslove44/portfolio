import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import ContactCta from "@/components/ui/contact-cta";
import SocialLinks from "@/components/ui/social-links";

export default function Footer() {
	const t = useTranslations("footer");

	return (
		<footer className="border-t border-border py-8 text-sm text-text-secondary">
			<div className="flex flex-col items-center gap-4 text-center">
				<p>{t("cta")} <ContactCta text={t("ctaLink")} /></p>
				<div className="flex flex-col sm:flex-row items-center gap-6">
					<nav className="flex items-center gap-4">
						<Link href="/" className="transition-colors hover:text-text-primary">{t("nav.home")}</Link>
						<Link href="/projects" className="transition-colors hover:text-text-primary">{t("nav.projects")}</Link>
						<Link href="/blog" className="transition-colors hover:text-text-primary">{t("nav.blog")}</Link>
						<NextLink href="/resume" className="transition-colors hover:text-text-primary">{t("nav.resume")}</NextLink>
					</nav>
					<SocialLinks />
				</div>
			</div>
		</footer>
	);
}
