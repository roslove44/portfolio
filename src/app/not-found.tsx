import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function NotFound() {
	return (
		<html lang="en">
			<body className="min-h-screen bg-background text-text-primary font-sans antialiased">
				<div className="mx-auto max-w-3xl px-3 sm:px-6">
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
				</div>
			</body>
		</html>
	);
}
