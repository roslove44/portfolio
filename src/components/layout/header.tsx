import { Link } from "@/i18n/navigation";
import ThemeToggle from "@/components/ui/theme-toggle";
import LangSwitch from "@/components/ui/lang-switch";

export default function Header() {
	return (
		<header className="flex items-end justify-between py-8">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-accent"
			>
				Skip to content
			</a>
			<Link href="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
				rostand.dev
			</Link>
			<div className="flex items-center gap-2">
				<LangSwitch />
				<ThemeToggle />
			</div>
		</header>
	);
}
