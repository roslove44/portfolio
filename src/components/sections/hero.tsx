import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";
import SocialLinks from "@/components/ui/social-links";

function Bullet({ children }: { children: React.ReactNode }) {
	return (
		<li className="relative pl-4">
			<span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-text-secondary" />
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
			<div className="flex items-start justify-between">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					{t("greeting")}
				</h1>
				<SocialLinks />
			</div>

			<ul className="mt-6 space-y-2 text-text-secondary text-[15px]">
				<Bullet>{t("bullet1")}</Bullet>
				<Bullet>
					{t("bullet2_prefix")}
					<TechName>Symfony</TechName>, <TechName>Next.js</TechName>{" "}
					{t("and")} <TechName>Go</TechName>
					{t("bullet2_suffix")}
				</Bullet>
				<Bullet>
					{t("bullet3_prefix")}
					<a
						href="https://comptaopen.com"
						className="text-text-primary underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
					>
						ComptaOpen
					</a>
					{t("bullet3_suffix")}
				</Bullet>
			</ul>

			<p className="mt-8 text-text-secondary text-[15px]">
				{t("cta")}
				<button className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent">
					{t("ctaLink")}
				</button>
				<Bot size={16} className="ml-1.5 inline-block animate-bot-float text-accent" />
			</p>
		</section>
	);
}
