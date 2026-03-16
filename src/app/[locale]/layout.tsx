import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, TWITTER_HANDLE } from "@/data/constants";
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
			locale,
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
		alternates: {
			canonical: url,
			languages: {
				en: `${SITE_URL}/en`,
				fr: `${SITE_URL}/fr`,
				"x-default": `${SITE_URL}/en`,
			},
			types: { "application/rss+xml": "/feed.xml" },
		},
		icons: { icon: "/favicon.ico" },
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
