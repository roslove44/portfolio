import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
	const t = useTranslations("footer");

	return (
		<footer className="border-t border-border py-8 text-sm text-text-secondary">
			<p>
				{t("cta")}{" "}
				<Link
					href="/contact"
					className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent"
				>
					{t("ctaLink")}
				</Link>
				{" →"}
			</p>
		</footer>
	);
}
