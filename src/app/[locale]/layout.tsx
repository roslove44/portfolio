import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("title"),
		description: t("description"),
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
							<main className="mx-auto max-w-3xl px-6">
								<Header />
								{children}
								<Footer />
							</main>
						</div>
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
