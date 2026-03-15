import { useTranslations } from "next-intl";
import ContactCta from "@/components/ui/contact-cta";

export default function Footer() {
	const t = useTranslations("footer");

	return (
		<footer className="border-t border-border py-8 text-sm text-text-secondary">
			<p>
				{t("cta")}{" "}
				<ContactCta text={t("ctaLink")} />
			</p>
		</footer>
	);
}
