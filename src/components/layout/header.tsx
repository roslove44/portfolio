import { Link } from "@/i18n/navigation";
import ThemeToggle from "@/components/ui/theme-toggle";
import LangSwitch from "@/components/ui/lang-switch";

export default function Header() {
	return (
		<header className="flex items-end justify-between py-8">
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
