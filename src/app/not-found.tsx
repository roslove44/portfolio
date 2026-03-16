import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Page not found | Rostand MIGAN",
	robots: { index: false, follow: false },
};

export default function NotFound() {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
				<div className="min-h-screen bg-background text-text-primary">
					<div className="mx-auto max-w-3xl px-3 sm:px-6">
						<header className="flex items-center justify-between py-4">
							<Link href="/en" className="text-sm font-medium text-text-primary hover:text-accent">
								Rostand MIGAN
							</Link>
						</header>
						<main>
							<div className="flex flex-col items-center justify-center gap-8 py-20 text-center">
								<Image src="/404.svg" alt="Page not found" width={320} height={280} className="w-full max-w-xs h-auto" loading="eager" unoptimized />
								<div>
									<h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
									<p className="mt-2 text-sm text-text-secondary">This page doesn&apos;t exist or has been moved.</p>
								</div>
								<Link href="/en" className="inline-flex items-center gap-1.5 text-accent hover:underline text-sm">
									<ArrowLeft size={14} />Back to home
								</Link>
							</div>
						</main>
						<footer className="border-t border-border py-6 text-center text-xs text-text-secondary">
							&copy; {new Date().getFullYear()} Rostand MIGAN
						</footer>
					</div>
				</div>
			</body>
		</html>
	);
}
