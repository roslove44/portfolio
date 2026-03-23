import { useTranslations } from "next-intl";
import SocialLinks from "@/components/ui/social-links";
import ContactCta from "@/components/ui/contact-cta";
import Avatar from "@/components/ui/avatar";

function Bullet({ children }: { children: React.ReactNode }) {
	return (
		<li className="relative pl-4">
			<span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-text-secondary" aria-hidden="true" />
			{children}
		</li>
	);
}

function TechName({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-text-primary underline decoration-accent/30 underline-offset-4">
			{children}
		</span>
	);
}

export default function Hero() {
	const t = useTranslations("hero");

	return (
		<section className="py-8">
			<div className="flex items-center justify-between flex-col sm:flex-row gap-2">
				<div className="flex items-center gap-3">
					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						{t("greeting")}
						<span className="sr-only"> - Full Stack Developer</span>
					</h1>
					<Avatar />
				</div>
				<SocialLinks />
			</div>

			<ul className="mt-6 space-y-2 text-text-primary text-[15px]">
				<Bullet>{t("bullet1")}</Bullet>
				<Bullet>
					{t("bullet2_prefix")}
					<TechName>Symfony</TechName>, <TechName>Next.js</TechName>{" "}
					{t("and")} <TechName>Go</TechName>
					{t("bullet2_suffix")}
				</Bullet>
				<Bullet>
					{t("bullet3_prefix")}
					<span
						className="text-text-primary underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
					>
						ComptaOpen
					</span>
					{t("bullet3_suffix")}
				</Bullet>
			</ul>

			<p className="mt-6 text-text-primary text-[15px]">
				{t("cta")} {" "}
				<ContactCta text={t("ctaLink")} />
			</p>
		</section>
	);
}
