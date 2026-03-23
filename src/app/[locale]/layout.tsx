import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, TWITTER_HANDLE, SOCIAL_LINKS, STACK_CATEGORIES } from "@/data/constants";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ThemeCookieSync from "@/components/ui/theme-cookie-sync";
import "../globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });
	const url = `${SITE_URL}/${locale}`;
	const twitterHandle = TWITTER_HANDLE;
	const ogLocale = locale === "fr" ? "fr_FR" : "en_US";

	return {
		metadataBase: new URL(SITE_URL),
		title: {
			default: t("title"),
			template: `%s | Rostand MIGAN`,
		},
		description: t("description"),
		robots: {
			index: true,
			follow: true,
			googleBot: { index: true, follow: true, "max-image-preview": "large" },
		},
		openGraph: {
			type: "website",
			locale: ogLocale,
			url,
			siteName: "Rostand MIGAN",
			title: t("title"),
			description: t("description"),
		},
		twitter: {
			card: "summary_large_image",
			site: twitterHandle,
			creator: twitterHandle,
			title: t("title"),
			description: t("description"),
		},
		icons: {
			icon: [
				{ url: "/icon.svg", type: "image/svg+xml" },
				{ url: "/icon.png", type: "image/png" },
				{ url: "/favicon.ico", sizes: "any" },
			],
			apple: [{ url: "/apple-icon.png", type: "image/png" }],
		},
		appleWebApp: { title: "Portfolio - Rostand MIGAN" },
		alternates: {
			canonical: url,
			languages: {
				en: `${SITE_URL}/en`,
				fr: `${SITE_URL}/fr`,
				"x-default": `${SITE_URL}/en`,
			},
			types: {
				"application/rss+xml": [
					{ url: "/feed.xml", title: "Rostand MIGAN — Blog (EN)" },
					{ url: "/feed-fr.xml", title: "Rostand MIGAN — Blog (FR)" },
				],
			},
		},
	};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const cookieStore = await cookies();
	const theme = cookieStore.get("theme")?.value;

	return (
		<html lang={locale} className={`scroll-smooth ${theme === "dark" ? "dark" : ""}`} suppressHydrationWarning data-scroll-behavior="smooth">
			<head>
				<Script id="microsoft-clarity" strategy="afterInteractive">
					{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "vwsayk7lxq");`}
				</Script>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@graph": [
								{
									"@type": "WebSite",
									name: "Rostand MIGAN",
									url: SITE_URL,
									inLanguage: ["en", "fr"],
								},
								{
									"@type": "Person",
									name: "Rostand MIGAN",
									url: SITE_URL,
									image: `${SITE_URL}/avatar.webp`,
									jobTitle: "Full-Stack Developer",
									description: "Full stack developer building web applications, SaaS platforms and developer tools. Comfortable across the entire stack, from React and Next.js to Symfony, Node.js and Go.",
									knowsAbout: [
										"Full-Stack Development", "Fintech", "SaaS", "Open Source",
										"REST API", "GraphQL", "Web Performance", "SEO", "Accessibility",
										...Object.values(STACK_CATEGORIES).flat().map((t) => t.name),
									],
									hasOccupation: {
										"@type": "Occupation",
										name: "Full-Stack Developer",
										occupationalCategory: "15-1252.00",
										skills: Object.values(STACK_CATEGORIES).flat().map((t) => t.name).join(", "),
									},
									knowsLanguage: [
										{ "@type": "Language", name: "French", alternateName: "fr" },
										{ "@type": "Language", name: "English", alternateName: "en" },
									],
									nationality: { "@type": "Country", name: "Benin" },
									address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" },
									sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.x],
								},
							],
						}),
					}}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<ThemeCookieSync />
					<NextIntlClientProvider>
						<div className="min-h-screen bg-background text-text-primary">
							<div className="mx-auto max-w-3xl px-3 sm:px-6">
								<Header />
								<main id="main-content">
									{children}
								</main>
								<Footer />
							</div>
						</div>
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
